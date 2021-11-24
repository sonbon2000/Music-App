const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player');
const progress = $('.progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        { 
            name: 'Cắt kéo trên Lê-nin',
            singer: 'Low-G',
            path: './assett/music/song1.mp3',
            image: './assett/img/img1.jpg'
        },
        {
            name: 'Chán gái 707',
            singer: 'Low-G',
            path: './assett/music/song2.mp3',
            image: './assett/img/img2.jpg'
        },
        {
            name: 'Flexin trên Circle K',
            singer: 'Low-G',
            path: './assett/music/song3.mp3',
            image: './assett/img/img3.jpg'
        },
        {
            name: 'Okeokeoke',
            singer: 'Low-G',
            path: './assett/music/song4.mp3',
            image: './assett/img/img4.jpg'
        },
        {
            name: 'Vua chơi trên mặt trăng',
            singer: 'Low-G',
            path: './assett/music/song5.mp3',
            image: './assett/img/img5.jpg'
        }
    ],
    render: function() {
        const html = this.songs.map((song,index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active': ''}" data-index = "${index}">
                <div class="thumb" style="background-image: url(${song.image})"></div>
                <div class="body">
                    <h3 class = "title">${song.name}</h3>
                    <p class = "author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playList.innerHTML = html.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth
        // Xử lí CD quay
        const cdThumbAnimate = cdThumb.animate({
            transform: 'rotate(360deg)'
        }, {
            duration: 10000,
            iterations: Infinity,
        })
        cdThumbAnimate.pause()

        //Xử lí phóng to thu nhỏ cd
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newWidth = cdWidth - scrollTop

            cd.style.width = newWidth > 0 ? newWidth + 'px': 0
            cd.style.opacity = newWidth / cdWidth
        }
        // Xử lí khi play
        playBtn.onclick = function () {
            if(_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
        // Khi song đc play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add("playing")
            cdThumbAnimate.play()
        }
        // Khi song pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove("playing")
            cdThumbAnimate.pause()
        }
        // Tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent
            }
        }
        // Replay bai hat
        audio.onended = function () {
            if(_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }
        // Lắng nghe hành vi click vào playlist
        playList.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')) {
                // Xử lí khi click song
                if(songNode) {
                    _this.currentIndex = Number(songNode.getAttribute('data-index'))
                    _this.loadCurrentSong()
                    audio.play()
                    _this.render()
                }
            }

        }
        // Xử lí khi tua songs
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }
        // Khi next song 
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            }
            else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
        }
        // Khi prev song
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            }
            else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // Xử lý random bật/tắt
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle("active", _this.isRandom)
            _this.playRandomSong()
        }
        // Xử lí repeat song
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle("active", _this.isRepeat)
        }

    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path
    },
    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        }
        while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    scrollToActiveSong: function() {
        setTimeout(function() {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }, 300)
    },
    start: function() {
        // Định nghĩa thuộc tính cho object
        this.defineProperties()
        // Lắng nghe xử lý sự kiện trong DOM
        this.handleEvent()
        // Tải thông tin bài hát đầu tiên
        this.loadCurrentSong()
        // Render ra songs
        this.render()
    }
}
app.start();