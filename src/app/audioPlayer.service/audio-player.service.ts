import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Song } from '../song.model';
@Injectable()
export class AudioPlayService{

    private audio = new Audio();
    public song = new Subject<Song>();
    public currentTime = new Subject<string>();
    public fullTime = new Subject<string>();
    public currentVolume = new Subject<number>();
    public songTitle = new Subject<string>();
    public pauseRePlayCheck = new Subject<boolean>();


    startPlay(song: Song) {
        this.audio.src = song.song;
        this.song.next(song);
        this.audio.play();
        this.audio.autoplay = false;
        this.audio.loop = false;
        
    }
    stopPlay() {
             this.audio.pause();
            this.audio.currentTime = 0;
            this.pauseRePlayCheck.next(true);
            this.audio.src = '';
            
    }
    pausePlay(pauseStatus: boolean) {

        if(!pauseStatus) {
          
                this.audio.pause();
                this.pauseRePlayCheck.next(true);
    
        } else {
            this.audio.play();
            this.pauseRePlayCheck.next(false);
          }

    }

    onPlayerSetting(song: Song) {
        this.pauseRePlayCheck.next(false);
        this.song.next(song);
        this.audio.src = song.song;
        let songTitleTag = song.song.substring(song.song.lastIndexOf('/') + 1); 
        this.songTitle.next(songTitleTag);
        this.audio.oncanplaythrough = () => {
            this.audio.play();
            
            this.fullTime.next(this.onCalculateTotalTime(this.audio.duration));
            this.currentVolume.next(this.audio.volume);
        };
        this.audio.ontimeupdate = () => {
            this.currentTime.next(this.onCalculateCurrentTime(this.audio.currentTime));
        };
        
    }

    playSetting(loopSetting: boolean, autoPlaySetting: boolean) {
        if (loopSetting) {
            this.audio.loop = true;
        } else {
            this.audio.loop = false;
        }
        if (autoPlaySetting) {
            this.audio.autoplay = true;
        } else {
            this.audio.autoplay = false;
        }

    }

    volumeSetting(volumeUp: boolean, volumeDown: boolean, volumenStop: boolean) {

    }

    onCalculateTotalTime(audioDuration: number){

        let minutes = Math.floor(audioDuration / 60);
        let seconds_int = audioDuration - minutes * 60;
        let seconds_str = seconds_int.toString();
        let seconds = seconds_str.substr(0, 2);
        let setTime = minutes + ':' + seconds;
    
      return setTime;
    }

    onCalculateCurrentTime(audioCurrentTime: number){
        let current_hour = audioCurrentTime / 3600 % 24;
        let current_minute_long = audioCurrentTime / 60 % 60;
        let current_minute = current_minute_long.toFixed();
        let current_seconds_long = audioCurrentTime % 60;
        let current_seconds = current_seconds_long.toFixed();
        let current_time = (parseInt(current_minute) < 10 ? "0" + current_minute : current_minute) + ":" + (parseInt(current_seconds) < 10 ? "0" + current_seconds : current_seconds);
    
      return current_time;
    } 
}