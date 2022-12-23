export class EmojiUtil {
    public static displayDuration = 3 // in seconds
    public static emMovingTractor = "emMovingTractor";
    public static emMovingTractorFrameSize = { x: 300, y: 270 }
    public static emMovingTractorYToXRatio = EmojiUtil.emMovingTractorFrameSize.x / EmojiUtil.emMovingTractorFrameSize.y;

    public static emojiTypesAndInstances = [
        [
            'emGoodjob',
            'emGoodjob2',
            'emGoodjob3',
            'emGoodjob4'
        ],
        [
            'emBadjob',
            'emBadjob2',
            'emBadjob3',
            'emBadjob4'
        ],
        [
            'emHappy',
            'emHappy2',
            'emHappy3',
            'emHappy4'
        ],
        [
            'emSad',
            'emSad2',
            'emSad3',
            'emSad4'
        ],
        [
            'emHurryup',
            'emHurryup2',
            'emHurryup3',
            'emHurryup4'
        ],
        [
            'emFireworks',
            'emFireworks2',
            'emFireworks3',
            'emFireworks4'
        ],
    ]
    public static emojiFrameSize = [
        [
            { x: 480, y: 480 },
            { x: 351, y: 274 },
            { x: 270, y: 160 },
            { x: 220, y: 217 },
        ],
        [
            { x: 480, y: 480 },
            { x: 480, y: 480 },
            { x: 480, y: 480 },
            { x: 180, y: 180 },
        ],
        [
            { x: 250, y: 270 },
            { x: 480, y: 480 },
            { x: 256, y: 256 },
            { x: 450, y: 450 },
        ],
        [
            { x: 250, y: 250 },
            { x: 480, y: 480 },
            { x: 480, y: 480 },
            { x: 300, y: 300 },
        ],
        [
            { x: 200, y: 200 },
            { x: 400, y: 400 },
            { x: 160, y: 160 },
            { x: 412, y: 522 },
        ],
        [
            { x: 480, y: 309 },
            { x: 500, y: 281 },
            { x: 408, y: 408 },
            { x: 190, y: 190 },
        ],
    ]
    public static emojiXToYRatio = [
        [
            EmojiUtil.emojiFrameSize[0][0].y / EmojiUtil.emojiFrameSize[0][0].x,
            EmojiUtil.emojiFrameSize[0][1].y / EmojiUtil.emojiFrameSize[0][1].x,
            EmojiUtil.emojiFrameSize[0][2].y / EmojiUtil.emojiFrameSize[0][2].x,
            EmojiUtil.emojiFrameSize[0][3].y / EmojiUtil.emojiFrameSize[0][3].x,
        ],
        [
            EmojiUtil.emojiFrameSize[1][0].y / EmojiUtil.emojiFrameSize[1][0].x,
            EmojiUtil.emojiFrameSize[1][1].y / EmojiUtil.emojiFrameSize[1][1].x,
            EmojiUtil.emojiFrameSize[1][2].y / EmojiUtil.emojiFrameSize[1][2].x,
            EmojiUtil.emojiFrameSize[1][3].y / EmojiUtil.emojiFrameSize[1][3].x,
        ],
        [
            EmojiUtil.emojiFrameSize[2][0].y / EmojiUtil.emojiFrameSize[2][0].x,
            EmojiUtil.emojiFrameSize[2][1].y / EmojiUtil.emojiFrameSize[2][1].x,
            EmojiUtil.emojiFrameSize[2][2].y / EmojiUtil.emojiFrameSize[2][2].x,
            EmojiUtil.emojiFrameSize[2][3].y / EmojiUtil.emojiFrameSize[2][3].x,
        ],
        [
            EmojiUtil.emojiFrameSize[3][0].y / EmojiUtil.emojiFrameSize[3][0].x,
            EmojiUtil.emojiFrameSize[3][1].y / EmojiUtil.emojiFrameSize[3][1].x,
            EmojiUtil.emojiFrameSize[3][2].y / EmojiUtil.emojiFrameSize[3][2].x,
            EmojiUtil.emojiFrameSize[3][3].y / EmojiUtil.emojiFrameSize[3][3].x,
        ],
        [
            EmojiUtil.emojiFrameSize[4][0].y / EmojiUtil.emojiFrameSize[4][0].x,
            EmojiUtil.emojiFrameSize[4][1].y / EmojiUtil.emojiFrameSize[4][1].x,
            EmojiUtil.emojiFrameSize[4][2].y / EmojiUtil.emojiFrameSize[4][2].x,
            EmojiUtil.emojiFrameSize[4][3].y / EmojiUtil.emojiFrameSize[4][3].x,
        ],
        [
            EmojiUtil.emojiFrameSize[5][0].y / EmojiUtil.emojiFrameSize[5][0].x,
            EmojiUtil.emojiFrameSize[5][1].y / EmojiUtil.emojiFrameSize[5][1].x,
            EmojiUtil.emojiFrameSize[5][2].y / EmojiUtil.emojiFrameSize[5][2].x,
            EmojiUtil.emojiFrameSize[5][3].y / EmojiUtil.emojiFrameSize[5][3].x,
        ],
    ]

    constructor() {
    }

    public static CreateAllAnimations(gs: Phaser.Scene) {
        gs.anims.create({
            key: "skin_dong_shenlvmeng",
            frameRate: 14,
            frames: gs.anims.generateFrameNumbers("skin_dong_shenlvmeng", { start: 0, end: 40 }),
            repeat: -1,
            hideOnComplete: false
        });
        gs.anims.create({
            key: "skin_dong_sunshangxiang",
            frameRate: 18,
            frames: gs.anims.generateFrameNumbers("skin_dong_sunshangxiang", { start: 0, end: 64 }),
            repeat: -1,
            hideOnComplete: false
        });
        gs.anims.create({
            key: "skin_dong_machao",
            frameRate: 33,
            frames: gs.anims.generateFrameNumbers("skin_dong_machao", { start: 0, end: 60 }),
            repeat: -1,
            hideOnComplete: false
        });
        gs.anims.create({
            key: "skin_dong_caiwenji",
            frameRate: 20,
            frames: gs.anims.generateFrameNumbers("skin_dong_caiwenji", { start: 0, end: 94 }),
            repeat: -1,
            hideOnComplete: false
        });
        gs.anims.create({
            key: "emGoodjob",
            frameRate: 2,
            frames: gs.anims.generateFrameNumbers("emGoodjob", { start: 0, end: 1 }),
            repeat: 2,
            hideOnComplete: true
        });
        gs.anims.create({
            key: "emGoodjob2",
            frameRate: 2,
            frames: gs.anims.generateFrameNumbers("emGoodjob2", { start: 0, end: 1 }),
            repeat: 2,
            hideOnComplete: true
        });
        gs.anims.create({
            key: "emGoodjob3",
            frameRate: 18,
            frames: gs.anims.generateFrameNumbers("emGoodjob3", { start: 0, end: 17 }),
            repeat: 2,
            hideOnComplete: true
        });
        gs.anims.create({
            key: "emGoodjob4",
            frameRate: 10,
            frames: gs.anims.generateFrameNumbers("emGoodjob4", { start: 0, end: 15 }),
            repeat: 1,
            hideOnComplete: true
        });

        gs.anims.create({
            key: "emBadjob",
            frameRate: 32,
            frames: gs.anims.generateFrameNumbers("emBadjob", { start: 0, end: 47 }),
            repeat: 2,
            hideOnComplete: true
        });
        gs.anims.create({
            key: "emBadjob2",
            frameRate: 32,
            frames: gs.anims.generateFrameNumbers("emBadjob2", { start: 0, end: 47 }),
            repeat: 2,
            hideOnComplete: true
        });
        gs.anims.create({
            key: "emBadjob3",
            frameRate: 24,
            frames: gs.anims.generateFrameNumbers("emBadjob3", { start: 0, end: 23 }),
            repeat: 2,
            hideOnComplete: true
        });
        gs.anims.create({
            key: "emBadjob4",
            frameRate: 19,
            frames: gs.anims.generateFrameNumbers("emBadjob4", { start: 0, end: 56 }),
            repeat: 0,
            hideOnComplete: true
        });

        gs.anims.create({
            key: "emHappy",
            frameRate: 18,
            frames: gs.anims.generateFrameNumbers("emHappy", { start: 0, end: 5 }),
            repeat: 8,
            hideOnComplete: true
        });
        gs.anims.create({
            key: "emHappy2",
            frameRate: 24,
            frames: gs.anims.generateFrameNumbers("emHappy2", { start: 0, end: 23 }),
            repeat: 2,
            hideOnComplete: true
        });
        gs.anims.create({
            key: "emHappy3",
            frameRate: 30,
            frames: gs.anims.generateFrameNumbers("emHappy3", { start: 0, end: 29 }),
            repeat: 2,
            hideOnComplete: true
        });
        gs.anims.create({
            key: "emHappy4",
            frameRate: 13,
            frames: gs.anims.generateFrameNumbers("emHappy4", { start: 0, end: 39 }),
            repeat: 0,
            hideOnComplete: true
        });

        gs.anims.create({
            key: "emSad",
            frameRate: 12,
            frames: gs.anims.generateFrameNumbers("emSad", { start: 0, end: 11 }),
            repeat: 2,
            hideOnComplete: true
        });
        gs.anims.create({
            key: "emSad2",
            frameRate: 24,
            frames: gs.anims.generateFrameNumbers("emSad2", { start: 0, end: 23 }),
            repeat: 2,
            hideOnComplete: true
        });
        gs.anims.create({
            key: "emSad3",
            frameRate: 8,
            frames: gs.anims.generateFrameNumbers("emSad3", { start: 0, end: 3 }),
            repeat: 5,
            hideOnComplete: true
        });
        gs.anims.create({
            key: "emSad4",
            frameRate: 22,
            frames: gs.anims.generateFrameNumbers("emSad4", { start: 0, end: 65 }),
            repeat: 0,
            hideOnComplete: true
        });

        gs.anims.create({
            key: "emHurryup",
            frameRate: 18,
            frames: gs.anims.generateFrameNumbers("emHurryup", { start: 0, end: 23 }),
            repeat: 1,
            hideOnComplete: true
        });
        gs.anims.create({
            key: "emHurryup2",
            frameRate: 8,
            frames: gs.anims.generateFrameNumbers("emHurryup2", { start: 0, end: 7 }),
            repeat: 2,
            hideOnComplete: true
        });
        gs.anims.create({
            key: "emHurryup3",
            frameRate: 26,
            frames: gs.anims.generateFrameNumbers("emHurryup3", { start: 0, end: 79 }),
            repeat: 0,
            hideOnComplete: true
        });
        gs.anims.create({
            key: "emHurryup4",
            frameRate: 11,
            frames: gs.anims.generateFrameNumbers("emHurryup4", { start: 0, end: 33 }),
            repeat: 0,
            hideOnComplete: true
        });

        gs.anims.create({
            key: "emFireworks",
            frameRate: 9,
            frames: gs.anims.generateFrameNumbers("emFireworks", { start: 0, end: 8 }),
            repeat: 2,
            hideOnComplete: true
        });
        gs.anims.create({
            key: "emFireworks2",
            frameRate: 20,
            frames: gs.anims.generateFrameNumbers("emFireworks2", { start: 0, end: 40 }),
            repeat: 1,
            hideOnComplete: true
        });
        gs.anims.create({
            key: "emFireworks3",
            frameRate: 8,
            frames: gs.anims.generateFrameNumbers("emFireworks3", { start: 0, end: 15 }),
            repeat: 1,
            hideOnComplete: true
        });
        gs.anims.create({
            key: "emFireworks4",
            frameRate: 10,
            frames: gs.anims.generateFrameNumbers("emFireworks4", { start: 0, end: 5 }),
            repeat: 4,
            hideOnComplete: true
        });

        gs.anims.create({
            key: "emMovingTractor",
            frameRate: 18,
            frames: gs.anims.generateFrameNumbers("emMovingTractor", { start: 0, end: 17 }),
            repeat: 2,
            hideOnComplete: true
        });
    }
}