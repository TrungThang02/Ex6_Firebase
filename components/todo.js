import React from 'react';
import { Alert } from 'react-native'; // Import Alert from react-native
import firestore from '@react-native-firebase/firestore';
import { List, Button, TouchableOpacity, Text } from 'react-native-paper';
const ref = firestore().collection('todoapp');

function Todo({ id, title, complete }) {
  async function toggleComplete() {
    await firestore()
      .collection('todoapp')
      .doc(id)
      .update({
        complete: !complete,
      });
  }
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


  async function handleDelete() {
      Alert.alert(
      'Are you sure?',
      'Do you want to delete?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            await firestore()
              .collection('todoapp')
              .doc(id)
              .delete();
             
          },
          
        },
      ],
      { cancelable: false }
    );
  }

  return (
    <List.Item
      title={title}
      onPress={() => toggleComplete()}
      right={() => (
        <Button onPress={() => handleDelete()}>
          Delete
        </Button>
      )}
    />
  );
}

export default Todo;
