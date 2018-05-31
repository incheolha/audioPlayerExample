import { Component, OnInit, OnDestroy } from '@angular/core';
import { AudioPlayService } from './audioPlayer.service/audio-player.service';
import { Song } from './song.model';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs';

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
  pauseReplaySubsrciption: Subscription;
  pauseReplayChecked = true;
  
  
  song = new Song('../assets/Track_028.mp3');

  constructor(private audioPlayService: AudioPlayService){}

  ngOnInit() {
  

    this.songSubscription = this.audioPlayService.song.subscribe((song: Song) => {

      console.log( song );
    });

    this.currentTimeSubscription = this.audioPlayService.currentTime
              .subscribe((currentTime: string) => {
                    console.log( currentTime )
              });
    this.fullTimeSubscription = this.audioPlayService.fullTime
                    .subscribe((fullTime: string) => {
                      console.log( fullTime );
                    });
    this.songTitleSubscription = this.audioPlayService.songTitle
                    .subscribe((songTitle: string) => {
                      console.log( songTitle );
                    })                
    this.currentVolumeSubscription = this.audioPlayService.currentVolume
                    .subscribe((volume: number)=> {
                       console.log(volume);
    })
    this.pauseReplaySubsrciption = this.audioPlayService.pauseRePlayCheck
                    .subscribe((pauseStatus: boolean) => {
                      console.log(pauseStatus);
                      this.pauseReplayChecked = pauseStatus;
                      console.log(this.pauseReplayChecked);

                    });
  }
  onPlay(buttonChecked: boolean) {
    console.log('song is clicked');
  //  this.audioPlayService.startPlay(this.song);
  
      this.audioPlayService.onPlayerSetting(this.song);
  }
  
  onPause(buttonChecked: boolean) {
    
    this.audioPlayService.pausePlay(this.pauseReplayChecked);
  }
  onStop() {
    console.log('song stop is clicked');
    
    this.audioPlayService.stopPlay();
  }


  onVolumeOff() {
    console.log('click');
  }
  onVolumeUp() {
    console.log('click');
  }
  onVolumeDown() {
    console.log('click');
  }

  ngOnDestroy() {
    this.currentTimeSubscription.unsubscribe();
    this.songSubscription.unsubscribe();
    this.songTitleSubscription.unsubscribe();
    this.fullTimeSubscription.unsubscribe();
    this.currentVolumeSubscription.unsubscribe();
  }
}
