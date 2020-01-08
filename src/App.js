import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import {
  Container,
  Form,
  Button,
  Loader,
  Header,
  Tab,
  Grid,
  Segment,
  Icon,
  Label,
} from 'semantic-ui-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from './firebase';

const selectMonth = monthNum => {
  switch(monthNum) {
    case 5:
      return 'june';
    case 6:
      return 'july';
    case 7:
      return 'august';
    default:
      return 'june';
  }
}

const selectDay = dayNum => {
  switch(dayNum) {
    case 0:
      return 'Sunday';
    case 1:
      return 'Monday';
    case 2:
      return 'Tuesday';
    case 3:
      return 'Wednesday';
    case 4:
      return 'Thursday';
    case 5:
      return 'Friday';
    case 6:
      return 'Saturday';
    default:
      return 'Sunday';
  }
}

function App() {
  const [ friends, setFriends ] = useState([]);
  const [ dates, setDates ] = useState([]);
  const [ loggedIn, setLoggedIn ] = useState(false);
  const [ currentUser, setCurrentUser ] = useState(null);
  const [ datesLoading, setDatesLoading ] = useState(false);
  const [ friendsLoading, setFriendsLoading ] = useState(false);

  useEffect(() => {
    setFriendsLoading(true);
    const friendsListener = db.collection('friends')
    .onSnapshot(friendsSnap => {
      if(!friendsSnap.empty) {
        setFriends(friendsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setFriendsLoading(false);
      }
    });

    setDatesLoading(true);
    const datesListener = db.collection('dates')
    .orderBy('date')
    .onSnapshot(datesSnap => {
      if(!datesSnap.empty) {
        setDates(datesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setDatesLoading(false);
      }
    });

    return () => {
      friendsListener();
      datesListener();
    }

  }, []);

  const handleLogin = e => {
    const friend = friends.find(friend => friend.id === e.target.name.value.toLowerCase());
    if(friend) {
      setCurrentUser(friend);
      setLoggedIn(true);
    } else {
      toast.error(`That ain't the name of a friend!`);
      e.target.name.value = '';
    }
  }

  const handleLogout = () => {
    setCurrentUser(null);
    setLoggedIn(false);
  }

  const filterJune = day => {
    const month = selectMonth(day.date.toDate().getMonth());
    if(month === 'june') {
      return true;
    }
  }

  const filterJuly = day => {
    const month = selectMonth(day.date.toDate().getMonth());
    if(month === 'july') {
      return true;
    }
  }

  const filterAugust = day => {
    const month = selectMonth(day.date.toDate().getMonth());
    if(month === 'august') {
      return true;
    }
  }

  const hasUser = day => {
    return day.people.find(person => person === currentUser.id);
  }

  const addUserToDay = day => {
    db.collection('dates')
    .doc(day.id)
    .update({
      people: firebase.firestore.FieldValue.arrayUnion(currentUser.id),
    })
    // .then(() => {
    //   const dateString = `${day.date.toDate().getMonth() + 1}/${day.date.toDate().getDate()} - ${selectDay(day.date.toDate().getDay())}`
    //   toast.success(`Joined date: ${dateString}`);
    // })
    .catch(err => {
      console.log(err);
      toast.error(err.message);
    });
  }

  const removeUserFromDay = day => {
    db.collection('dates')
    .doc(day.id)
    .update({
      people: firebase.firestore.FieldValue.arrayRemove(currentUser.id),
    })
    // .then(() => {
    //   const dateString = `${day.date.toDate().getMonth() + 1}/${day.date.toDate().getDate()} - ${selectDay(day.date.toDate().getDay())}`
    //   toast.success(`Removed from date: ${dateString}`);
    // })
    .catch(err => {
      console.log(err);
      toast.error(err.message);
    });
  }

  const findFriendColor = friendId => {
    const friend = friends.find(friend => friend.id === friendId);
    if(friend) {
      return friend.color;
    } else {
      return 'grey';
    }
  }

  const MonthTab = ({ filterCallback = () => {}, title = "" }) => (
    <Tab.Pane>
      <Header textAlign="center" as="h3">{ title }</Header>
      <Grid doubling stackable columns={7}>
        { dates.filter(filterCallback).map(day => {
          const dateString = `${day.date.toDate().getMonth() + 1}/${day.date.toDate().getDate()} - ${selectDay(day.date.toDate().getDay())}`;

          return (
            <Grid.Column key={dateString}>
              <Segment>
                <Header as="h3" textAlign="center">
                  { dateString }
                  {
                    hasUser(day) ? 
                    <Icon onClick={() => removeUserFromDay(day)} style={{ marginLeft: '15px' }} name="minus square" /> :
                    <Icon onClick={() => addUserToDay(day)} style={{ marginLeft: '15px' }} name="plus square" />
                  }
                </Header>
                { day.people.map(person => (
                  <Label key={person} as="div" color={findFriendColor(person)}>{person}</Label>
                )) }
              </Segment>
            </Grid.Column>
          );
        }) }
      </Grid>
    </Tab.Pane>
  )

  const panes = [
    {
      menuItem: 'June',
      render: () => <MonthTab filterCallback={filterJune} title="June" />,
    },
    {
      menuItem: 'July',
      render: () => <MonthTab filterCallback={filterJuly} title="July" />,
    },
    {
      menuItem: 'August',
      render: () => <MonthTab filterCallback={filterAugust} title="August" />,
    }
  ]

  return (
    <>
      { !loggedIn && !currentUser && !datesLoading && !friendsLoading && (
        <Container>
          <Header as="h1" textAlign="center">Badass Friends Beach Gathering 2020</Header>
          <Form onSubmit={handleLogin}>
            <Form.Field>
              <label>First Name</label>
              <input name="name" placeholder="Putcha foist name in ya filty rat!" />
            </Form.Field>
            <Button type="submit">Log In</Button>
          </Form>
        </Container>
      ) }

      { loggedIn && currentUser && !datesLoading && !friendsLoading && (
        <>
          <Header as="h1" textAlign="center">Badass Friends Beach Gathering 2020</Header>
          <Header as="h3" textAlign="center">Welcome {currentUser.name}</Header>
          <Header as="h4" textAlign="center">Not { currentUser.name }? <Button onClick={handleLogout}>Logout</Button></Header>
          <Tab panes={panes} />
        </>
      ) }

      { datesLoading && (
        <Loader>Loading dates...</Loader>
      ) }

      { friendsLoading && (
        <Loader>Loading friends...</Loader>
      ) }

      <ToastContainer
        position="bottom-left"
        autoClose={2000}
        closeOnClick
        draggable={false}
        newestOnTop={true}
      />
    </>
  );
}

export default App;
