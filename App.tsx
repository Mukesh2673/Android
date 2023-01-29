/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import Feather from 'react-native-vector-icons/Feather';
//import Icon from 'react-native-vector-icons';
const COLORS = {primary: '#1f145c', white: '#fff'};

const App = () => {
  const [textInput, setTextInput] = React.useState('');
  const [todos, setTodos] = React.useState([
    {id: 1, task: 'First todo', completed: true},
    {id: 2, task: 'second todos', completed: false},
  ]);

  React.useEffect(() => {
    getTodoFromUserDevice();
  }, []);

  React.useEffect(() => {
    saveTodoToUserDevice(todos);
  }, [todos]);

  // eslint-disable-next-line react/no-unstable-nested-components
  const ListItem = ({todo}: {todo: any}) => {
    return (
      <View style={styles.listItem}>
        <View style={{flex: 1}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 15,
              color: COLORS.primary,
              textDecorationLine: todo?.completed ? 'line-through' : 'none',
            }}>
            {todo?.task}
          </Text>
        </View>
        {!todo?.completed && (
          <TouchableOpacity
            style={[styles.actionIcon]}
            onPress={() => markTodoComplete(todo?.id)}>
            <Feather name="check" size={20} color={COLORS.white} />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.actionIcon, {backgroundColor: 'red'}]}
          onPress={() => deleteTodo(todo?.id)}>
          <Feather name="trash" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    );
  };

  const getTodoFromUserDevice = async () => {
    try {
      const todos = await AsyncStorage.getItem('@storage_Key');
      if (todos != null) {
        setTodos(JSON.parse(todos));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const addTodo = () => {
    if (textInput == '') {
      Alert.alert('Error', 'please input todo');
    } else {
      const newTodo = {
        id: Math.random(),
        task: textInput,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setTextInput('');
    }
  };
  const markTodoComplete = (todoId: any) => {
    const newtodos = todos.map((item: any) => {
      if (item.id === todoId) {
        return {...item, completed: true};
      }
      return item;
    });
    setTodos(newtodos);
  };
  const deleteTodo = (todoId: any) => {
    const newTodo = todos.filter(item => item.id != todoId);
    setTodos(newTodo);
  };

  const clearTodos = () => {
    Alert.alert('confirm', 'Are you sure want Delete your Todos', [
      {
        text: 'yes',
        onPress: () => setTodos([]),
      },
      {text: 'No'},
    ]);
  };

  const saveTodoToUserDevice = async (todos: any) => {
    try {
      const stringifyTodos = JSON.stringify(todos);
      await AsyncStorage.setItem('@storage_Key', stringifyTodos);
    } catch (e) {
      //console.log('err', re);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <View style={styles.header}>
        <Text style={{fontWeight: 'bold', fontSize: 20, color: COLORS.primary}}>
          Todo app
        </Text>
        <Feather name="trash" size={50} color="red" onPress={clearTodos} />
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 20, paddingBottom: 100}}
        data={todos}
        renderItem={({item}) => <ListItem todo={item} />}
      />
      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput
            value={textInput}
            placeholder="Add Todo"
            onChangeText={text => {
              setTextInput(text);
            }}
          />
        </View>
        <TouchableOpacity onPress={addTodo}>
          <View style={styles.iconContainer}>
            <Feather name="plus" color={COLORS.white} size={30} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    color: COLORS.white,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    elevation: 40,
    flex: 1,
    height: 50,
    marginVertical: 20,
    marginRight: 20,
    marginRadius: 30,
    paddingHorizontal: 20,
  },
  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    elevation: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    padding: 20,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,
  },
  actionIcon: {
    height: 25,
    width: 25,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    borderRadius: 3,
  },
});
export default App;
