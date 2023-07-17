import * as React from 'react';
import Navigation from "./Navigation";
import NavigationPartner from './NavigationPartner';
import NavigationEmployee from './NavigationEmployee';
import { NavLink } from 'react-router-dom'
import store from '../redux/store';

const MainListItems = () => {

  const state = store.getState();
  let nav = [];
  const isMobile = /mobile|android/i.test(navigator.userAgent);


  if(state && state.user.role !== ''){
    if(state.user?.role === 'PARTNER_ROLE'){
      if(state.user.partner.name === 'OLYMPO'){
        nav = NavigationEmployee;
      }else{
        nav = NavigationPartner;
      }
    }
    if(state.user.role === 'ADMIN_ROLE'){
      nav = Navigation;
    }
    if(state.user.role === 'EMPLOYEE_ROLE'){
      nav = NavigationEmployee;
    }
  }

  return (
    !isMobile && (
      <div>
        <nav>
          <ul>
            {nav.map((navItem, i) => (
              <ChildrenItems key={i} menu={navItem} />
            ))}
          </ul>
        </nav>
      </div>
    )
  );
}

const ChildrenItems = props => {
  const { menu } = props; 
  return (
    <NavLink exact={true} className='liNavLink' activeStyle={{borderBottom: '4px solid #80BB57', color: '#80BB57', fontWeight: 'bold'}} to={menu.url}>{menu.title}</NavLink>
  )
}

export { MainListItems };
