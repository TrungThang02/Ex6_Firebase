import React from 'react';
import firestore from '@react-native-firebase/firestore';
import { FlatList, View } from 'react-native';
import { Appbar, TextInput, Button } from 'react-native-paper';
import Todo from './components/todo';
import Icon from 'react-native-vector-icons/MaterialIcons';

function App() {
  const [todo, setTodo] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [todoapp, setTodos] = React.useState([]);
  const ref = firestore().collection('todoapp');

  async function loadData() {
    const querySnapshot = await ref.get();
    const list = [];
    querySnapshot.forEach(doc => {
      const { title, complete } = doc.data();
      list.push({
        id: doc.id,
        title,
        complete,
      });
    });
    setTodos(list);
  }

  async function addTodo() {
    await ref.add({
      title: todo,
      complete: false,
    });
    setTodo('');
    loadData();
  }

  React.useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await ref.get();
      const list = [];
      querySnapshot.forEach(doc => {
        const { title, complete } = doc.data();
        list.push({
          id: doc.id,
          title,
          complete,
        });
      });
      setTodos(list);
      if (loading) {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar>
        <Appbar.Content title={'Todo app'} />
      </Appbar>
      <FlatList
        style={{ flex: 1 }}
        data={todoapp}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <Todo {...item} />}
      />
      <TextInput label={'Add new Todo'} value={todo} onChangeText={text => setTodo(text)} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 }}>
        <Button onPress={addTodo} style={{ flex: 1, marginRight: 10 }}>
          ADD
        </Button>
        <Button onPress={loadData} style={{ flex: 1, marginLeft: 10 }}>
          LOAD DATA
        </Button>
      </View>
    </View>
  );
}

export default App;
