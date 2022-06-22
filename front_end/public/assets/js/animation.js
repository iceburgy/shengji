var canvas = document.body.appendChild(document.createElement('canvas'));
canvas.id = 'decadeUI-canvas';
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

var config = { alpha: true };
var gl = canvas.getContext('gl', config) || canvas.getContext('experimental-webgl', config);

// var decadeUIPath = "./"
var decadeUIPath = "./shengjiweb/"

var spine2D;
if (gl) {
    spine2D = {
        shader: spine.webgl.Shader.newTwoColoredTextured(gl),
        batcher: new spine.webgl.PolygonBatcher(gl),
        skeletonRenderer: new spine.webgl.SkeletonRenderer(gl),
        shapes: new spine.webgl.ShapeRenderer(gl),
        assetManager: new spine.webgl.AssetManager(gl),
        assets: {},
        playing: {},
        skeletons: [],
    }
} else {
    console.error('当前设备不支持 WebGL.');
}

function Receipt(fileName, onload, onerror) {
    this.name = fileName;
    this.fileName = fileName;
    this.onload = onload;
    this.onerror = onerror;
    this.loads = 0;
    this.errors = 0;
};

var anim = {
    gl: gl,
    canvas: canvas,
    spine2D: spine2D,
    lastFrameTime: undefined,
    loadSpine2D: function (fileName, onload, onerror) {
        var anim = this;
        var receipt = new Receipt(fileName, onload, onerror);

        receipt.loadSuccess = function () {
            receipt.loads++;
            if (receipt.loads + receipt.errors == 3) {
                if (receipt.errors > 0) {
                    if (receipt.onerror !== void 0) {
                        receipt.onerror();
                    }
                } else {
                    anim.spine2D.assets[receipt.fileName] = receipt.fileName;
                    if (receipt.onload !== void 0) {
                        receipt.onload();
                    }
                }
            }
        };

        receipt.loadError = function () {
            receipt.errors++;
            if (receipt.loads + receipt.errors == 3) {
                if (receipt.onerror !== void 0) {
                    receipt.onerror();
                }
            }
        };

        this.spine2D.assetManager.loadBinary(decadeUIPath + 'assets/animation/' + fileName + '.skel',
            receipt.loadSuccess, receipt.loadError);
        this.spine2D.assetManager.loadText(decadeUIPath + 'assets/animation/' + fileName + '.atlas',
            receipt.loadSuccess, receipt.loadError);
        this.spine2D.assetManager.loadTexture(decadeUIPath + 'assets/animation/' + fileName + '.png',
            receipt.loadSuccess, receipt.loadError);
    },
    prepareSpine2D: function (name) {
        if (!this.spine2D.assets[name]) return console.error('未找到' + name + '动画资源.');

        var assetManager = this.spine2D.assetManager;
        var atlas = new spine.TextureAtlas(assetManager.get(decadeUIPath + 'assets/animation/' + name + '.atlas'),
            function (path) {
                return assetManager.get(decadeUIPath + 'assets/animation/' + path);
            }
        );

        var atlasLoader = new spine.AtlasAttachmentLoader(atlas);
        var skeletonBinary = new spine.SkeletonBinary(atlasLoader);
        var skeletonData = skeletonBinary.readSkeletonData(assetManager.get(decadeUIPath + 'assets/animation/' + name + '.skel'));
        var skeleton = new spine.Skeleton(skeletonData);
        var skeletons = this.spine2D.skeletons;

        skeleton.setSkinByName('default');
        skeleton.setToSetupPose();
        skeleton.updateWorldTransform();

        var bounds = {
            offset: new spine.Vector2(),
            size: new spine.Vector2(),
        };

        skeleton.getBounds(bounds.offset, bounds.size, []);
        var animationStateData = new spine.AnimationStateData(skeleton.data);
        var animationState = new spine.AnimationState(animationStateData);

        animationState.addListener({
            complete: function (track) {
                if (!track.loop) {
                    skel.complete = true;
                }
            }
        });

        var skel = {
            id: skeletons.length,
            name: name,
            animationName: skeletonData.animations[0].name,
            skeleton: skeleton,
            state: animationState,
            bounds: bounds,
            displayBounds: undefined,
            premultipliedAlpha: false,
            complete: true,
            mvp: new spine.webgl.Matrix4(),
        };

        skel.mvp.ortho2d(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
        skeletons.push(skel);

        return skel.id;
    },
    playSpine2D: function (name, x, y, width, height, animationName, loop) {
        if (!this.spine2D.assets[name]) return; // console.error('未找到"' + name + '"的动画资源.');

        var displayBounds = {
            x: x,
            y: y,
            width: width,
            height: height,
        };

        var assetManager = this.spine2D.assetManager;
        var skeletons = this.spine2D.skeletons;
        var skeleton;

        for (var i = 0; i < skeletons.length; i++) {
            if (skeletons[i].name == name && skeletons[i].complete) {
                skeleton = skeletons[i];
                skeletons.splice(i, 1, skeleton);
                break;
            }
        }

        if (!skeleton) {
            this.prepareSpine2D(name);
            for (var i = skeletons.length - 1; i >= 0; i--) {
                if (skeletons[i].name == name) {
                    skeleton = skeletons[i];
                }
            }
        }

        skeleton.complete = false;
        skeleton.displayBounds = displayBounds;
        skeleton.state.setAnimation(0, animationName == void 0 ? skeleton.animationName : animationName, false);

        if (this.requestID == void 0) {
            this.requestID = requestAnimationFrame(this.render);
        }

        return skeleton.id;
    },
    stopSpine2D: function (index) {
        var skeleton = this.spine2D.skeletons[index];
        skeleton.complete = true;
        skeleton.state.setEmptyAnimation(0);
    },
    resizeSkeleton: function (skeleton) {
        var canvas = this.canvas;
        var width = canvas.clientWidth;
        var height = canvas.clientHeight;
        var bounds = skeleton.bounds;
        if (canvas.width != width || canvas.height != height) {
            canvas.width = width;
            canvas.height = height;
        }

        var displayX = skeleton.displayBounds.x;
        var displayY = skeleton.displayBounds.y;
        var displayW = skeleton.displayBounds.width;
        var displayH = skeleton.displayBounds.height;

        var centerX = bounds.offset.x + bounds.size.x / 2;
        var centerY = bounds.offset.y + bounds.size.y / 2;
        var scaleX = bounds.size.x / (displayW != void 0 ? displayW : canvas.width);
        var scaleY = bounds.size.y / (displayH != void 0 ? displayH : canvas.height);

        var scale;
        if (scaleX > scaleY) {
            scale = scaleX;
        } else {
            scale = scaleY;
        }

        if (scale < 1) scale = 1;

        var w = canvas.width * scale;
        var h = canvas.height * scale;

        var x = displayX == void 0 ? centerX - (w / 2) : 0 - (displayX + displayW / 2) * scale;
        var y = displayY == void 0 ? centerY - (h / 2) : 0 - (displayY + displayH / 2) * scale;

        skeleton.mvp.ortho2d(
            x,
            y,
            w,
            h
        );

        gl.viewport(0, 0, canvas.width, canvas.height);
    },
    render: function () {
        var skeletons = anim.spine2D.skeletons;
        var now = Date.now() / 1000;

        var delta = now - (anim.lastFrameTime == undefined ? now : anim.lastFrameTime);
        anim.lastFrameTime = now;

        var complete = true;
        for (var i = 0; i < skeletons.length; i++) {
            if (!skeletons[i].complete) {
                complete = false;
                break;
            }
        }

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        if (complete) {
            anim.lastFrameTime = undefined;
            anim.requestID = undefined
            return;
        }

        var state, skeleton, bounds, premultipliedAlpha;
        var shader = anim.spine2D.shader;
        var batcher = anim.spine2D.batcher;
        var skeletonRenderer = anim.spine2D.skeletonRenderer;

        for (var i = 0; i < skeletons.length; i++) {
            if (skeletons[i].complete) continue;

            anim.resizeSkeleton(skeletons[i]);
            state = skeletons[i].state;
            skeleton = skeletons[i].skeleton;
            bounds = skeletons[i].bounds;
            premultipliedAlpha = skeletons[i].premultipliedAlpha;

            state.update(delta);
            state.apply(skeleton);
            skeleton.updateWorldTransform();

            shader.bind();
            shader.setUniformi(spine.webgl.Shader.SAMPLER, 0);
            shader.setUniform4x4f(spine.webgl.Shader.MVP_MATRIX, skeletons[i].mvp.values);

            batcher.begin(shader);
            skeletonRenderer.premultipliedAlpha = premultipliedAlpha;
            skeletonRenderer.draw(batcher, skeleton);
            batcher.end();

            shader.unbind();
        }

        anim.requestID = requestAnimationFrame(anim.render);
    },
};

if (!gl) {
    for (var key in anim) {
        if (typeof anim[key] == 'function') {
            anim[key] = function () { };
        }
    }
}


var assets = [
    'effect_qinglongyanyuedao',
    'effect_shoujidonghua',
]

for (var i = 0; i < assets.length; i++) {
    anim.loadSpine2D(assets[i], function () {
        anim.prepareSpine2D(this.name);
    });
}

function skillAnimate(skillName, nature, wid, hei) {
    // effect_qinglongyanyuedao, 31, 22, 120, 180
    // effect_shoujidonghua, 0, 0, 120, 180, "play6"
    var x = 0;
    var y = 0;
    var w = wid;
    var h = hei;
    if (nature) anim.playSpine2D(skillName, x, y, w, h, nature);
    else anim.playSpine2D(skillName, x, y, w, h);
}
