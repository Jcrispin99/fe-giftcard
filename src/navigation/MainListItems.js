import * as React from 'react';
import Navigation from "./Navigation";
import NavigationPublic from './NavigationPublic';
import { NavLink } from 'react-router-dom'

const MainListItems = (props) => {

  let nav = (props?.type) ? NavigationPublic : Navigation;

  return (
    <div>
      <nav>
        <ul>
          {nav.map((nav, i) => {
            return (
              <ChildrenItems key={i} menu={nav} />
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

const ChildrenItems = props => {
  const { menu } = props; 
  return (
    <NavLink exact={true} className='liNavLink' activeStyle={{borderBottom: '4px solid #80BB57', color: '#80BB57', fontWeight: 'bold'}} to={menu.url}>{menu.title}</NavLink>
  )
}

export { MainListItems };
