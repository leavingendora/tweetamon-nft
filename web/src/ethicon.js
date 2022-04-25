export default class Ethicon {
    margin = 0.08
    background = [24, 20, 37, 255]
    scheme_default = [
        [[[127, 6, 34, 255], [214, 36, 17, 255], [214, 36, 17, 255]], "Fire"],
        [[[214, 36, 17, 255], [255, 132, 38, 255], [255, 132, 38, 255]], "Fire"],
        [[[255, 132, 38, 255], [255, 209, 0, 255], [255, 209, 0, 255]], "Fire"],
        [[[148, 33, 106, 255], [255, 38, 116, 255], [255, 38, 116, 255]], "Psychic"],
        [[[67, 0, 103, 255], [148, 33, 106, 255], [148, 33, 106, 255]], "Psychic"],
        [[[0, 40, 89, 255], [35, 73, 117, 255], [35, 73, 117, 255]], "Water"],
        [[[0, 40, 89, 255], [0, 120, 153, 255], [0, 120, 153, 255]], "Water"],
        [[[35, 73, 117, 255], [104, 174, 212, 255], [104, 174, 212, 255]], "Water"],
        [[[104, 174, 212, 255], [250, 253, 255, 255], [250, 253, 255, 255]], "Ice"],
        [[[0, 120, 153, 255], [16, 210, 117, 255], [16, 210, 117, 255]], "Grass"],
        [[[16, 210, 117, 255], [191, 255, 60, 255], [191, 255, 60, 255]], "Grass"],
    ]
    scheme_unique = [
        [[[127, 6, 34, 255], [214, 36, 17, 255], [255, 132, 38, 255]], "Fire"],
        [[[214, 36, 17, 255], [255, 132, 38, 255], [255, 209, 0, 255]], "Fire"],
        [[[67, 0, 103, 255], [148, 33, 106, 255], [255, 38, 116, 255]], "Psychic"],
        [[[0, 40, 89, 255], [0, 120, 153, 255], [104, 174, 212, 255]], "Water"],
        [[[0, 120, 153, 255], [16, 210, 117, 255], [191, 255, 60, 255]], "Grass"],
    ]

    stats = {
        "base_cp": 100,
        "base_attack": 100,
        "base_defend": 100,
        "type": ""
    }

    constructor(address, size) {
        this.address = address.substr(2)
        this.address = window.sha256(this.address.toString()).substring(0, 45 + 3)
        this.size = size
    }

    getBase64() {
        return this.render().getBase64();
    }

    getStats() {
        return this.stats;
    }

    rect(image, x, y, w, h, color) {
        for (var i = x; i < x + w; i++) {
            for (var j = y; j < y + h; j++) {
                image.buffer[image.index(i, j)] = color;
            }
        }
    }

    render() {
        var image = new PNGlib(this.size, this.size, 256)
        var baseMargin = Math.floor(this.size * this.margin)
        var cell = Math.floor((this.size - (baseMargin * 2)) / 9)
        var margin = Math.floor((this.size - cell * 9) / 2)

        // Unique selector
        var scheme
        if (this.address.charCodeAt(0) % 16 == 1) {
            scheme = this.scheme_unique
        } else {
            scheme = this.scheme_default
        }

        // Palette selector
        var selector = this.address.charCodeAt(1) % scheme.length
        var color_bg = image.color.apply(image, this.background)
        var color_default = image.color.apply(image, scheme[selector][0][0])
        var color_highlight = image.color.apply(image, scheme[selector][0][1])
        var color_accent = image.color.apply(image, scheme[selector][0][2])

        // Update stats
        this.stats.type = scheme[selector][1]
        this.stats.base_cp = this.stats.base_cp + (this.address.charCodeAt(45) % 16) * 17
        this.stats.base_attack = this.stats.base_attack + (this.address.charCodeAt(46) % 16) * 5
        this.stats.base_defend = this.stats.base_defend + (this.address.charCodeAt(47) % 16) * 4

        // Render
        for (var i = 0; i < 45; i++) {
            var x = i % 5
            var y = Math.floor(i / 5)
            var color;

            var character = this.address.charCodeAt(i)
            if (character % 13 == 1) {
                color = this.address.charCodeAt(i + 1) % 2 ? color_highlight : color_accent
            } else if (character % 3 == 1) {
                color = color_default;

            } else {
                color = color_bg;
            }
            //console.log(i + ":" + x + "|" + y)
            this.rect(image, x * cell + margin, y * cell + margin, cell, cell, color)
            this.rect(image, (8 - x) * cell + margin, y * cell + margin, cell, cell, color)
        }

        return image;
    }

}