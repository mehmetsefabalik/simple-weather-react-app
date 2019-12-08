import React, { FunctionComponent } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar'
import { DailyWeather } from '../interfaces';
import { getIconUrl } from '../util';

interface Props {
  data: DailyWeather[];
}

const Content: FunctionComponent<Props> = ({ data }) => {
  return <>
    <List>
      {
        Array.isArray(data) ?
        data.map((daily, i) => {
          return <ListItem key={i.toString()}>
            <ListItemAvatar>
              <Avatar src={getIconUrl(daily.weather.icon)}>
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={daily.datetime} />
          </ListItem>
        })
          :
          <div>Data Not Found</div>
      }
    </List>
  </>
}

export { Content };
