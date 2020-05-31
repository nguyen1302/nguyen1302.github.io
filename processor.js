let processor = {
    timerCallback: function() {
        if (this.video.paused || this.video.ended) {
            return;
        }
        this.computeFrame();
        let self = this;
        setTimeout(function() {
            self.timerCallback();
        }, 0);
    },

    doLoad: function() {
        this.video = document.getElementById("video");
        this.c1 = document.getElementById("c1");
        this.ctx1 = this.c1.getContext("2d");
        this.c2 = document.getElementById("c2");
        this.ctx2 = this.c2.getContext("2d");
        let self = this;
        this.video.addEventListener("play", function() {
            self.width = self.video.videoWidth * 2;
            self.height = self.video.videoHeight * 2;
            self.timerCallback();
        }, false);
    },

    computeFrame: function() {
        this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
        let frame = this.ctx1.getImageData(0, 0, this.width, this.height);
        let frame_2 = this.ctx1.getImageData(0, 0, this.width, this.height);
        let frame_3 = this.ctx1.getImageData(0, 0, this.width, this.height);

        for (let y = 0; y < frame.height; y++) {
            for (let x = 0; x < frame.width; x++) {
                let i = (y * 4) * frame.width + x * 4;
                let avg = frame.data[i] * 0.1140 + frame.data[i + 1] * 0.5870 + frame.data[i + 2] * 0.2989;
                frame_2.data[i] = avg;
                frame_2.data[i + 1] = avg;
                frame_2.data[i + 2] = avg;
            }
        }
        for (let y = 1; y < frame.height - 1; y++) {
            for (let x = 1; x < frame.width - 1; x++) {
                let i = (y * 4) * frame.width + x * 4;
                let fx = 1 / 4 * ((frame_2.data[((y - 1) * 4 * frame.width + (x - 1) * 4)] + 2 * frame_2.data[(y * 4 * frame.width + (x - 1) * 4)] + frame_2.data[((y + 1) * 4 * frame.width + (x - 1) * 4)]) - (frame_2.data[((y - 1) * 4 * frame.width + (x + 1) * 4)] + 2 * frame_2.data[(y * 4 * frame.width + (x + 1) * 4)] + frame_2.data[((y + 1) * 4 * frame.width + (x + 1) * 4)]));
                let fy = 1 / 4 * ((frame_2.data[((y - 1) * 4 * frame.width + (x - 1) * 4)] + 2 * frame_2.data[((y - 1) * 4 * frame.width + x * 4)] + frame_2.data[((y - 1) * 4 * frame.width + (x + 1) * 4)]) - (frame_2.data[((y + 1) * 4 * frame.width + (x - 1) * 4)] + 2 * frame_2.data[((y + 1) * 4 * frame.width + x * 4)] + frame_2.data[((y + 1) * 4 * frame.width + (x + 1) * 4)]))
                frame_3.data[i] = Math.sqrt(fx * fx + fy * fy);
                frame_3.data[i + 1] = Math.sqrt(fx * fx + fy * fy);
                frame_3.data[i + 2] = Math.sqrt(fx * fx + fy * fy);
            }
        }
        this.ctx2.putImageData(frame_3, 0, 0, 0, 0, this.width, this.height);

        return;
    }
};

document.addEventListener("DOMContentLoaded", () => {
    processor.doLoad();
});