import { Component, OnInit, OnDestroy, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { AudioPlayService } from './audioPlayer.service/audio-player.service';
import { Song } from './song.model';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs';
import { WavesModule, PreloadersModule } from 'ng-uikit-pro-standard';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {


  songSubscription: Subscription;
  fullTimeSubscription: Subscription;
  currentTimeSubscription: Subscription;
  songTitleSubscription: Subscription;
  currentVolumeSubscription: Subscription;
  pauseReplaySubscription: Subscription;
  currentProgressiveBarValueSubscription: Subscription;
  
  pauseChecked = false;
  
  private volume: number;
  
  private songTitle: string;
  private fullTime: string;
  private currentTime: string;
  private progressBarValue: string;
  private proBar: number;
  private proBarPercent: number;
  

// Slider Bar 구성하기

@ViewChild('input') input: ElementRef;
@ViewChild('rangeCloud') rangeCloud: ElementRef;
@ViewChild('progressbar') progressbar: ElementRef;
range: any = 50;


  constructor(private audioPlayService: AudioPlayService,
              private renderer: Renderer2){}

  ngOnInit() {
    
                this.audioPlayService.getAudioPlaySetting();        //초기 audio setting값을 불러옴

                this.songTitleSubscription = this.audioPlayService.songTitle
                                              .subscribe((songTitle: string) => {
                                                console.log( '현재 노래의 타이틀은: ' + songTitle );
                                                this.songTitle = songTitle;
                                              })    
                this.fullTimeSubscription = this.audioPlayService.fullTime
                                              .subscribe((fullTime: string) => {
                                                console.log( '현재 노래중인 노래의 총길이는: ' + fullTime );
                                                this.fullTime = fullTime;
                                              });
                
                this.currentVolumeSubscription = this.audioPlayService.currentVolume
                                              .subscribe((currentVolume: number)=> {
                                                console.log('현재 노래의 볼륨은: ' + currentVolume);
                                                this.volume = currentVolume;
                                              });
                
                this.currentTimeSubscription = this.audioPlayService.currentTime
                                                .subscribe((currentTime: string) => {
                                                     console.log( '현재 노래중인 시간은:' + currentTime );
                                                     this.currentTime = currentTime;
                                                });
                this.currentProgressiveBarValueSubscription = this.audioPlayService.currentProgressValue
                                                  .subscribe((barValue: number) => {
                                                    this.progressBarValue = barValue.toFixed(6);
                                                    console.log('원시 오디오값은:' + this.progressBarValue);
                                                    this.proBar = parseFloat(this.progressBarValue);
                                                    this.proBarPercent = (this.proBar / 100);
                                                    console.log(this.proBar);
                                                  });
                
                this.pauseReplaySubscription = this.audioPlayService.pauseCheck
                                              .subscribe((pauseStatus: boolean) => {
                                                this.pauseChecked = pauseStatus;
                                                console.log('현재 pause button을 보이고자하는 값은: '+ this.pauseChecked )
                                              });
  }

  // slider bar function -----
  coverage() {
    if (typeof this.range === "string" && this.range.length !== 0) {
      return this.range;
    }
    // console.log(this.input.nativeElement.value);
    const maxValue = this.input.nativeElement.getAttribute('max');
    console.log(maxValue);
    const cloudRange = (this.range / maxValue) * 100;
    console.log(cloudRange);
    this.audioPlayService.volumeSetting(true, 0, true, cloudRange);
    this.renderer.setStyle(this.rangeCloud.nativeElement, 'left', cloudRange + '%')
  }

  





        onPlay() {
            console.log('button type 1 clicked');
            this.audioPlayService.startAudioPlay();
        }
        
        onPause() {
          console.log('button type 2 clicked');
          this.audioPlayService.pauseAudioPlay();
        }

        onStop() {

          console.log('button type 3 clicked');
          this.audioPlayService.stopAudioPlay();
        }
        
        onVolumeOff() {
          console.log('click');
          this.audioPlayService.volumeSetting(true, 0, true, null);
        }
        onVolumeUp() {
          console.log('click');
          this.audioPlayService.volumeSetting(false, this.volume, true, null);
        }
        onVolumeDown() {
          console.log('click');
          this.audioPlayService.volumeSetting(false, this.volume, false, null);
        }

        ngOnDestroy() {
          this.currentTimeSubscription.unsubscribe();
          this.songSubscription.unsubscribe();
          this.songTitleSubscription.unsubscribe();
          this.fullTimeSubscription.unsubscribe();
          this.currentVolumeSubscription.unsubscribe();
          this.pauseReplaySubscription.unsubscribe();
        }
}
