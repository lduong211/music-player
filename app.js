const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('.header .song-name');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd-image');
const playBtn = $('.btn-play');
const pauseBtn = $('.btn-pause');
const progress = $('#progress');
const nextBtn = $('.btn-forward');
const prevBtn = $('.btn-backward');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playList = $('.list-music');

const app = {
    currentIndex: 0,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "Hẹn Gặp Em Dưới Ánh Trăng",
            singer: "HURRYKNG, HIEUTHUHAI, MANBO",
            path: "./assets/songs/hen-gap-em-duoi-anh-trang.mp3",
            image: "https://i.ytimg.com/vi/dLmczwDCEZI/maxresdefault.jpg"
        },
        {
            name: "Chỉ Một Đêm Nữa Thôi",
            singer: "MCK & TLinh",
            path: "./assets/songs/chi-mot-dem-nua-thoi.mp3",
            image: "https://i.ytimg.com/vi/GHs_RYQIog8/mqdefault.jpg"
        },
        {
            name: "3 1 0 7",
            singer: "Dương & Nâu",
            path: "./assets/songs/3107.mp3",
            image: "https://i.ytimg.com/vi/V5GS5ANG96M/maxresdefault.jpg"
        },
        {
            name: "Có Người",
            singer: "Vũ Cát Tường",
            path: "./assets/songs/co-nguoi.mp3",
            image: "https://i.ytimg.com/vi/BhbETPFyuaY/maxresdefault.jpg"
        },
        {
            name: "Dù Cho Mai Về Sau",
            singer: "buitruonglinh & Freak D",
            path: "./assets/songs/du-cho-mai-ve-sau.mp3",
            image: "https://i.ytimg.com/vi/Lz8G_Hwc8B8/sddefault.jpg"
        },
        {
            name: "Giá Như",
            singer: "Noo Phước Thịnh",
            path: "./assets/songs/gia-nhu.mp3",
            image: "https://i.ytimg.com/vi/lpOlTa895TQ/sddefault.jpg"
        },
        {
            name: "Ghé Qua",
            singer: "Dick & Tofu & PC",
            path: "./assets/songs/ghe-qua.mp3",
            image: "https://i1.sndcdn.com/artworks-000319063860-5qw7nd-t500x500.jpg"
        },
        {
            name: "Chỉ Là Không Cùng Nhau",
            singer: "Tăng Phúc & Trương Thái Nhi",
            path: "./assets/songs/chi-la-khong-cung-nhau.mp3",
            image: "https://i.ytimg.com/vi/UqKVL56IJB8/maxresdefault.jpg"
        },
        {
            name: "Tất Cả Sẽ Thay Anh",
            singer: "Tăng Phúc",
            path: "./assets/songs/tat-ca-se-thay-anh.mp3",
            image: "https://nhacchuongmoinhat.com/wp-content/uploads/2020/06/T%E1%BA%A5t-C%E1%BA%A3-S%E1%BA%BD-Thay-Anh-%E2%80%93-T%C4%83ng-Ph%C3%BAc.jpg"
        },
        {
            name: "Alaba Trap",
            singer: "Tommy Tèo & MCK",
            path: "./assets/songs/alaba-trap.mp3",
            image: "https://i.ytimg.com/vi/0lG5Y6cGcBc/maxresdefault.jpg"
        }
    ],

    render: function () {
        const html = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        });
        playList.innerHTML = html.join('');
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function() {

        const _this = this;
        const cdWidth = cd.offsetWidth;
        //xử lý cd thumb quay và dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], { 
            duration: 10000,
            iterations: Infinity,
        });

        cdThumbAnimate.pause();

        //Xử lý phóng to / thu nhỏ
        document.onscroll = function () {
            document.onscroll = function () {
                const scrollTop = window.scrollY || document.documentElement.scrollTop;
                const newWidth = cdWidth - scrollTop;
                cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
                cd.style.opacity = newWidth / cdWidth;
            }
        }

        //Xử lý khi click play / pause
        playBtn.onclick = function() {
            audio.play();
            playBtn.classList.add('playing');
            pauseBtn.classList.remove('playing');
            cdThumbAnimate.play();
        }
        pauseBtn.onclick = function() {
            audio.pause();
            playBtn.classList.remove('playing');
            pauseBtn.classList.add('playing');
            cdThumbAnimate.pause();
        }
        
        // Xử lý khi đang play
        audio.ontimeupdate = function() {
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        //Xử lý khi tua
        progress.onchange = function(e) {
            const seekTime = e.target.value / 100 * audio.duration;
            audio.currentTime = seekTime;
        }

        //Xử lý next / prev
        nextBtn.onclick = function() {
            if(_this.isRandom){
                _this.randomSong();
                audio.play();
                playBtn.onclick();
            }else{
                _this.nextSong();
                audio.play();
                playBtn.onclick();
            }
            _this.render();
        }
        prevBtn.onclick = function() {
            if(_this.isRandom){
                _this.randomSong();
                audio.play();
                playBtn.onclick();
            }else{
                _this.prevSong();
                audio.play();
                playBtn.onclick();
            }
            _this.render();
        }
        
        //Xử lý random
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom;
            e.target.classList.toggle('active', _this.isRandom);
        }

        //Xử lý repeat
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat;
            e.target.classList.toggle('active', _this.isRepeat);
        }

        //Xử lý next khi audio end
        audio.onended = function() {
            if(_this.isRepeat)
            {
                audio.play();
            }else
                nextBtn.click();
        }

        // Xử lý click vào list
        playList.onclick = function(e) {
            let songNode = e.target.closest('.song:not(.active)');
            let optionNode = e.target.closest('.option');
            if(songNode || optionNode){
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    audio.play();
                    playBtn.onclick();
                    _this.render();
                }
                if(optionNode)
                    console.log('test')   
            };
        }

    },

    //Load bài hát hiện tại
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path;
        // console.log(audio);
    },

    //Next song
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length)
            this.currentIndex = 0;
        this.loadCurrentSong();
    },

    //Prev song
    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0)
            this.currentIndex = this.songs.length - 1;
        this.loadCurrentSong();
    },

    //random song
    randomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        }while(newIndex == this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function () {
        this.defineProperties();

        this.handleEvents();

        this.loadCurrentSong();
        
        this.render();
    }
};

app.start();