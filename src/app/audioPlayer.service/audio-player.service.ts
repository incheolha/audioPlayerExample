import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Song } from '../song.model';
import { Subscription } from 'rxjs/Subscription';
import { AppComponent } from '../app.component';
@Injectable()
export class AudioPlayService{

    private audio = new Audio();
    public song = new Song('../assets/Track_028.mp3');
    

    public currentTime = new Subject<string>();
    public fullTime = new Subject<string>();
    public currentVolume = new Subject<number>();
    
    public songTitle = new Subject<string>();
    public pauseCheck = new Subject<boolean>();
    public currentProgressValue = new Subject<number>();
    
// NgOnInit()에서 제일 먼제 audio에 관한 초기 setting값을 저정한다
// 특히 oncanplaythrough()이벤트 method에 subject로 방출할 초기값을 지정해준다.
// 현재 진행중인 audio.currentTime은 ontimeupdate()이벤트 method안에 넣어 주어 항상 현재 진행중인 값을 방출하도록 한다

    getAudioPlaySetting() {
        this.audio.src = this.song.song;
        let songTitleTag = this.song.song.substring(this.song.song.lastIndexOf('/') + 1);  //song URl중 filename만 발취하기
      
        this.audio.oncanplaythrough = () => {
                        this.songTitle.next(songTitleTag);
                        
                        this.fullTime.next(this.onCalculateTotalTime(this.audio.duration));
                        this.currentVolume.next((this.audio.volume - 0.5) * 100);
                        this.currentTime.next(this.onCalculateCurrentTime(this.audio.currentTime));
                       
          };
        this.audio.ontimeupdate = () => {
                        let barValue = 0;
                        this.currentTime.next(this.onCalculateCurrentTime(this.audio.currentTime));
                        barValue = ((this.audio.currentTime / this.audio.duration ) * 100);
                        if (barValue <= 100) {
                            
                            this.currentProgressValue.next(barValue);
                        } else {
                            barValue = 100;
                        }
            };
        
    }

// audio start button 클릭시 작동 
    startAudioPlay() {
            if (this.audio.paused) {
            this.audio.play();
            this.pauseCheck.next(true);
        } 
    }
// audio pause button 클릭시 작동
    pauseAudioPlay() {

        if (!this.audio.paused) {
            this.audio.pause();
            this.pauseCheck.next(false);
        }
     }
 
 // audio play button 클릭시 작동
    stopAudioPlay() {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.pauseCheck.next(false);
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


    volumeSetting(muted: boolean, volume: number, volumeUp: boolean) {

        const maxVolume = 100;
        const minVolume = 1;
        let newVolume = 0;
        
        if (muted) {
            newVolume = 0;
        } else {
                    if (volumeUp) {
                        newVolume = volume + 10;
                        if (newVolume > maxVolume) {
                            newVolume = maxVolume;
                        } 
                    } else {
                        newVolume = volume - 10;
                        if (newVolume < minVolume) {
                            newVolume = minVolume;
                        } 
                    }
    }
    this.audio.volume = (newVolume / 100);
    this.currentVolume.next(newVolume);
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
        let cur_mins = '';
        let cur_secs = '';

      let mins = Math.floor(audioCurrentTime / 60);
      let secs = Math.floor(audioCurrentTime % 60);
      if (mins < 10) {
          cur_mins = '0'+ String(mins);
      } else {
          cur_mins = String(mins);
      }
      if(secs < 10) {
          cur_secs = '0'+ String(secs);
      } else {
          cur_secs = String(secs);
      }

      let current_time = cur_mins + ': '+ cur_secs;
      return current_time;
    } 
   
}