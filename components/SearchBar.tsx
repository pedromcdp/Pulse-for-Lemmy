// SearchBar.js
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Button, Keyboard, StyleSheet, TextInput, View } from 'react-native';

import theme from '@/theme/theme';

const SearchBar = () => {
  const [clicked, setClicked] = React.useState(false);
  const [searchPhrase, setSearchPhrase] = React.useState('');

  return (
    <View style={styles.container}>
      <View
        style={
          clicked ? styles.searchBar__clicked : styles.searchBar__unclicked
        }
      >
        {/* search Icon */}
        <Ionicons
          name="ios-search"
          size={20}
          color="gray"
          style={{ marginLeft: 1 }}
        />
        {/* Input field */}
        <TextInput
          style={styles.input}
          placeholder="Search"
          placeholderTextColor={theme.colors.gray}
          value={searchPhrase}
          onChangeText={setSearchPhrase}
          onFocus={() => {
            setClicked(true);
          }}
        />
        {/* cross Icon, depending on whether the search bar is clicked or not */}
        {clicked && (
          <Ionicons
            name="ios-close-circle"
            size={20}
            color="black"
            style={{ padding: 1 }}
            onPress={() => {
              setSearchPhrase('');
            }}
          />
        )}
      </View>
      {/* cancel button, depending on whether the search bar is clicked or not */}
      {clicked && (
        <View>
          <Button
            title="Cancel"
            onPress={() => {
              Keyboard.dismiss();
              setClicked(false);
            }}
          ></Button>
        </View>
      )}
    </View>
  );
};
export default SearchBar;

// styles
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    left: -15,
    paddingHorizontal: 10,
    width: '100%',
  },
  searchBar__unclicked: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: theme.colors.secondaryBG,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  searchBar__clicked: {
    padding: 5,
    flexDirection: 'row',
    width: '80%',
    backgroundColor: '#d9dbda',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  input: {
    fontSize: 18,
    marginLeft: 5,
    width: '90%',
  },
});
