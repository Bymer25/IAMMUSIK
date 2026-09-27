import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Audio } from 'expo-av';

export default function PlayerScreen() {
  const params = useLocalSearchParams();
  const { trackId, currentIndex, playlistIds } = params;
  
  // Данные треков (такие же как в index.tsx)
  const tracks = [
    // Chicago треки
    { 
      id: '1', 
      title: 'Faneto', 
      artist: 'Chief Keef', 
      city: 'chicago', 
      duration: '3:28', 
      plays: '89M',
      audioSource: require('../../assets/audio/chicago/Chief_Keef_-_Faneto_73159630.mp3'),
      image: require('../../assets/images/1000x1000.jpg')
    },
    { 
      id: '2', 
      title: 'Love Sosa', 
      artist: 'Chief Keef', 
      city: 'chicago', 
      duration: '4:06', 
      plays: '120M',
      audioSource: require('../../assets/audio/chicago/Chief_Keef_-_Love_Sosa_48211813.mp3'),
      image: require('../../assets/images/9ae4477b3a4c96df2fe59cc6fafd3b92.1000x1000x1.jpg')
    },
    { 
      id: '3', 
      title: 'Crazy Story', 
      artist: 'King Von', 
      city: 'chicago', 
      duration: '3:24', 
      plays: '45M',
      audioSource: require('../../assets/audio/chicago/King_Von_-_Crazy_Story_73159462.mp3'),
      image: require('../../assets/images/unnamed.jpg')
    },
    { 
      id: '4', 
      title: 'Took Her To The O', 
      artist: 'King Von', 
      city: 'chicago', 
      duration: '3:16', 
      plays: '38M',
      audioSource: require('../../assets/audio/chicago/King_Von_-_Took_Her_To_The_O_71659917.mp3'),
      image: require('../../assets/images/f60562dc4bfcd6e5bde7f8ddd789e116.jpg')
    },
    { 
      id: '5', 
      title: 'All My Life', 
      artist: 'Lil Durk', 
      city: 'chicago', 
      duration: '3:15', 
      plays: '52M',
      audioSource: require('../../assets/audio/chicago/Lil_Durk_-_All_My_Life_feat_J_Cole_76089218.mp3'),
      image: require('../../assets/images/5323318385657452873.jpg')
    },
    { 
      id: '6', 
      title: 'Back In Blood', 
      artist: 'Pooh Shiesty feat. Lil Durk', 
      city: 'chicago', 
      duration: '3:30', 
      plays: '67M',
      audioSource: require('../../assets/audio/chicago/Pooh_Shiesty_feat_Lil_Durk_-_Back_In_Blood_feat_Lil_Durk_71519247.mp3'),
      image: require('../../assets/images/1000x1000 (1).jpg')
    },

    // NYC треки
    { 
      id: '7', 
      title: 'Being Honest', 
      artist: 'Kay Flock', 
      city: 'nyc', 
      duration: '3:12', 
      plays: '8M',
      audioSource: require('../../assets/audio/nyc/Kay_Flock_-_Being_Honest_73500508.mp3'),
      image: require('../../assets/images/m1000x1000 (1).jpg')
    },
    { 
      id: '8', 
      title: 'Is Ya Ready', 
      artist: 'Kay Flock', 
      city: 'nyc', 
      duration: '3:05', 
      plays: '3M',
      audioSource: require('../../assets/audio/nyc/Kay_Flock_-_Is_Ya_Ready_73500501.mp3'),
      image: require('../../assets/images/m1000x1000 (1).jpg')
    },
    { 
      id: '9', 
      title: 'Brotherly Love', 
      artist: 'Kay Flock, B-Lovee, Dougie B', 
      city: 'nyc', 
      duration: '2:58', 
      plays: '12M',
      audioSource: require('../../assets/audio/nyc/Kay_Flock_B-Lovee_Dougie_B_-_Brotherly_Love_73500503.mp3'),
      image: require('../../assets/images/m1000x1000 (1).jpg')
    },
    { 
      id: '10', 
      title: 'Shake It', 
      artist: 'Kay Flock feat. Cardi B, Dougie B, Bory300', 
      city: 'nyc', 
      duration: '2:45', 
      plays: '5M',
      audioSource: require('../../assets/audio/nyc/Kay_Flock_feat_Cardi_B_Dougie_B_Bory300_-_Shake_It_74064257.mp3'),
      image: require('../../assets/images/m1000x1000 (2).jpg')
    },
  ];
  
  const [playlist, setPlaylist] = useState<string[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  
  const [sound, setSound] = useState<Audio.Sound>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  
  const soundRef = useRef<Audio.Sound>();
  const progressBarRef = useRef<View>(null);

  // Инициализация плейлиста
  useEffect(() => {
    if (playlistIds) {
      const ids = JSON.parse(playlistIds as string);
      setPlaylist(ids);
      const index = parseInt(currentIndex as string) || 0;
      setCurrentTrackIndex(index);
    }
  }, []);

  // Загрузка трека при изменении индекса
  useEffect(() => {
    if (playlist.length > 0 && currentTrackIndex >= 0 && currentTrackIndex < playlist.length) {
      const trackId = playlist[currentTrackIndex];
      const track = tracks.find(t => t.id === trackId);
      if (track) {
        setCurrentTrack(track);
      }
    }
  }, [currentTrackIndex, playlist]);

  // Загрузка аудио при изменении трека
  useEffect(() => {
    if (currentTrack) {
      configureAudio();
      loadAudio();
    }
    
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, [currentTrack]);

  // PanResponder для перемотки
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setIsSeeking(true);
    },
    onPanResponderMove: (evt, gestureState) => {
      if (progressBarRef.current) {
        progressBarRef.current.measure((x, y, width, height, pageX, pageY) => {
          const touchX = evt.nativeEvent.pageX - pageX;
          const percentage = Math.min(Math.max(touchX / width, 0), 1);
          const newPosition = percentage * duration;
          setPosition(newPosition);
        });
      }
    },
    onPanResponderRelease: async () => {
      if (soundRef.current && duration > 0) {
        const percentage = position / duration;
        const newPosition = percentage * duration;
        await soundRef.current.setPositionAsync(newPosition);
      }
      setIsSeeking(false);
    },
  });

  const configureAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error('Error configuring audio:', error);
    }
  };

  const loadAudio = async () => {
    try {
      setIsLoading(true);
      
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }
      
      const audioSource = currentTrack.audioSource;
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        audioSource,
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      
      setSound(newSound);
      soundRef.current = newSound;
      setIsPlaying(true);
      
    } catch (error) {
      console.error('Error loading audio:', error);
      Alert.alert('Ошибка загрузки', 'Не удалось загрузить аудиофайл');
    } finally {
      setIsLoading(false);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded && !isSeeking) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
      
      if (status.didJustFinish) {
        // Автоматически переключаем на следующий трек
        playNextTrack();
      }
    }
  };

  const togglePlayback = async () => {
    if (!sound) {
      await loadAudio();
      return;
    }

    try {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  };

  const playNextTrack = async () => {
    if (currentTrackIndex < playlist.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    } else {
      // Если это последний трек, перематываем на начало
      if (soundRef.current) {
        await soundRef.current.setPositionAsync(0);
        setPosition(0);
      }
    }
  };

  const playPreviousTrack = async () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    } else {
      // Если это первый трек, перематываем на начало
      if (soundRef.current) {
        await soundRef.current.setPositionAsync(0);
        setPosition(0);
      }
    }
  };

  const formatTime = (millis: number) => {
    if (!millis) return '0:00';
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!currentTrack) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#ff5500" />
      </SafeAreaView>
    );
  }

  const city = currentTrack.city;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
        disabled={isLoading}
      >
        <Text style={styles.backButtonText}>← Назад</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={[styles.cover, { backgroundColor: city === 'chicago' ? '#ff5500' : '#0066ff' }]}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <Image source={currentTrack.image} style={styles.coverImage} />
          )}
        </View>

        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle}>{currentTrack.title}</Text>
          <Text style={styles.trackArtist}>{currentTrack.artist}</Text>
          <View style={[styles.cityBadge, { backgroundColor: city === 'chicago' ? '#ff5500' : '#0066ff' }]}>
            <Text style={styles.cityBadgeText}>
              {city === 'chicago' ? 'Chicago' : 'New York'}
            </Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View 
            ref={progressBarRef}
            style={styles.progressBar}
            {...panResponder.panHandlers}
          >
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: duration ? `${(position / duration) * 100}%` : '0%',
                  backgroundColor: city === 'chicago' ? '#ff5500' : '#0066ff'
                }
              ]} 
            />
            <View 
              style={[
                styles.progressHandle,
                {
                  left: duration ? `${(position / duration) * 100}%` : '0%',
                  backgroundColor: city === 'chicago' ? '#ff5500' : '#0066ff'
                }
              ]} 
            />
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={playPreviousTrack}
            disabled={isLoading}
          >
            <Text style={styles.controlText}>⏮</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.playButton, 
              { backgroundColor: city === 'chicago' ? '#ff5500' : '#0066ff' }
            ]} 
            onPress={togglePlayback}
            disabled={isLoading}
          >
            <Text style={styles.playButtonText}>
              {isLoading ? '⏳' : (isPlaying ? '⏸' : '▶')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={playNextTrack}
            disabled={isLoading}
          >
            <Text style={styles.controlText}>⏭</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.trackCounter}>
          <Text style={styles.trackCounterText}>
            {currentTrackIndex + 1} / {playlist.length}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButtonText: {
    color: '#ff5500',
    fontSize: 16,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  cover: {
    width: 250,
    height: 250,
    borderRadius: 20,
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  trackInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  trackTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  trackArtist: {
    fontSize: 18,
    color: '#999',
    marginBottom: 15,
  },
  cityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cityBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  progressContainer: {
    width: '100%',
    marginBottom: 30,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    marginBottom: 10,
    position: 'relative',
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  progressHandle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    top: -4,
    marginLeft: -6,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: '#999',
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
    marginBottom: 20,
  },
  controlButton: {
    padding: 10,
  },
  controlText: {
    color: '#fff',
    fontSize: 24,
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ff5500',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff5500',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 32,
  },
  trackCounter: {
    marginTop: 10,
  },
  trackCounterText: {
    color: '#666',
    fontSize: 14,
  },
});