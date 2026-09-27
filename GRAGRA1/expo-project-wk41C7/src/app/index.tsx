import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// Типы для треков
type Track = {
  id: string;
  title: string;
  artist: string;
  city: 'chicago' | 'nyc';
  duration: string;
  plays: string;
  audioSource: any;
  image: any;
};

export default function HomeScreen() {
  const [selectedCity, setSelectedCity] = useState<'all' | 'chicago' | 'nyc'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Данные треков с изображениями
  const tracks: Track[] = [
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

  // Фильтрация треков
  const filteredTracks = tracks.filter(track => {
    if (selectedCity !== 'all' && track.city !== selectedCity) return false;
    if (searchQuery && !track.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !track.artist.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Артисты для быстрого выбора
  const artists = [
    { id: '1', name: 'Chief Keef', city: 'chicago', image: require('../../assets/images/1000x1000.jpg') },
    { id: '2', name: 'King Von', city: 'chicago', image: require('../../assets/images/unnamed.jpg') },
    { id: '3', name: 'Lil Durk', city: 'chicago', image: require('../../assets/images/5323318385657452873.jpg') },
    { id: '4', name: 'Pooh Shiesty', city: 'chicago', image: require('../../assets/images/1000x1000 (1).jpg') },
    { id: '5', name: 'Kay Flock', city: 'nyc', image: require('../../assets/images/m1000x1000 (1).jpg') },
  ];

  const renderTrackItem = ({ item }: { item: Track }) => (
    <TouchableOpacity 
      style={styles.trackItem}
      onPress={() => {
        // Формируем плейлист из отфильтрованных треков (только id)
        const playlistIds = filteredTracks.map(t => t.id);
        const currentIndex = filteredTracks.findIndex(t => t.id === item.id);
        
        router.push({
          pathname: '/player',
          params: { 
            trackId: item.id,
            currentIndex: currentIndex.toString(),
            playlistIds: JSON.stringify(playlistIds),
          }
        });
      }}
    >
      <View style={styles.trackInfo}>
        <Image source={item.image} style={styles.trackImage} />
        <View style={[styles.cityIndicator, { backgroundColor: item.city === 'chicago' ? '#ff5500' : '#0066ff' }]} />
        <View>
          <Text style={styles.trackTitle}>{item.title}</Text>
          <Text style={styles.trackArtist}>{item.artist}</Text>
        </View>
      </View>
      <View style={styles.trackStats}>
        <Text style={styles.trackPlays}>{item.plays}</Text>
        <Text style={styles.trackDuration}>{item.duration}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderArtistItem = ({ item }: { item: typeof artists[0] }) => (
    <TouchableOpacity 
      style={styles.artistCard}
      onPress={() => setSearchQuery(item.name)}
    >
      <Image source={item.image} style={styles.artistImage} />
      <Text style={styles.artistName}>{item.name}</Text>
      <Text style={styles.artistCity}>{item.city === 'chicago' ? 'Chicago' : 'NYC'}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.logo}>
          Grandson<Text style={styles.logoAccent}>Saund</Text>
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tracks or artists..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.cityFilters}>
        <TouchableOpacity
          style={[styles.cityFilter, selectedCity === 'all' && styles.cityFilterActive]}
          onPress={() => setSelectedCity('all')}
        >
          <Text style={[styles.cityFilterText, selectedCity === 'all' && styles.cityFilterTextActive]}>
            All Cities
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.cityFilter, styles.chicagoFilter, selectedCity === 'chicago' && styles.cityFilterActive]}
          onPress={() => setSelectedCity('chicago')}
        >
          <Text style={[styles.cityFilterText, selectedCity === 'chicago' && styles.cityFilterTextActive]}>
            Chicago
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.cityFilter, styles.nycFilter, selectedCity === 'nyc' && styles.cityFilterActive]}
          onPress={() => setSelectedCity('nyc')}
        >
          <Text style={[styles.cityFilterText, selectedCity === 'nyc' && styles.cityFilterTextActive]}>
            New York
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Artists</Text>
          <FlatList
            data={artists}
            renderItem={renderArtistItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.artistList}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Tracks</Text>
          <FlatList
            data={filteredTracks}
            renderItem={renderTrackItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Стили остаются без изменений
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoAccent: {
    color: '#ff5500',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchInput: {
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
  cityFilters: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  cityFilter: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#111',
    alignItems: 'center',
  },
  chicagoFilter: {
    backgroundColor: '#331100',
  },
  nycFilter: {
    backgroundColor: '#001133',
  },
  cityFilterActive: {
    backgroundColor: '#ff5500',
  },
  cityFilterText: {
    color: '#fff',
    fontWeight: '500',
  },
  cityFilterTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  artistList: {
    marginBottom: 10,
  },
  artistCard: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
  artistImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
    backgroundColor: '#333',
  },
  artistName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  artistCity: {
    color: '#999',
    fontSize: 12,
  },
  trackItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  trackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  trackImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#333',
  },
  cityIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  trackTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  trackArtist: {
    color: '#999',
    fontSize: 14,
  },
  trackStats: {
    alignItems: 'flex-end',
  },
  trackPlays: {
    color: '#999',
    fontSize: 12,
    marginBottom: 2,
  },
  trackDuration: {
    color: '#ff5500',
    fontSize: 14,
    fontWeight: '500',
  },
});