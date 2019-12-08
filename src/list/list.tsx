import React, { FunctionComponent } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar'


interface Country {
  name: string;
  flag: string;
  capital: string;
}

interface Prop {
  countries: Country[];
  onCountryClick: (capital: string) => void;
}

const CountryList: FunctionComponent<Prop> = ({ countries, onCountryClick }) => {
  return <div className='list-container'>
    <List>
      {
        countries.map((country, i) => {
          return <ListItem key={i.toString()} onClick={() => onCountryClick(country.capital)}>
          <ListItemAvatar>
            <Avatar src={country.flag}>
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={country.name} secondary={country.capital} />
        </ListItem>
        })
      }
    </List>
  </div>;
}

export { CountryList }