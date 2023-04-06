import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUI } from '../../app/context/ui';
import { ModalCustomStyles } from '../../assets/css';
import { AuthService } from '../../services';

const GiftCardCustomer = () => {

  const modalStyle = ModalCustomStyles();
  const [card, setCard] = useState({});
  const { blockUI } = useUI();
  const location = useLocation();
  const authService = new AuthService();

  const getMyCard = async() => {
    try {
      const code = location.pathname.substring(20);
      const r1 = await authService.mycard(code);
      setCard(r1.data.card);
    } catch (error) {
      blockUI.current.open(false);
    }
  }

  useEffect(() => {
    (async function init() {
      await getMyCard();
    })();
  }, []);

  return (
    <div className={modalStyle.wrapperCustomerGiftCard}>
      <div className={modalStyle.wrapperViewGiftcard}>
        <article className="gift-card animate__animated animate__rotateInDownLeft">
          <div className="gift-card__image">
          </div>
          <section className="gift-card__content">
            <div className="gift-card__amount">S/.{card.amount}</div>
            <div className="gift-card__amount-remaining">S/{card.amounAvailable} Disponible</div>    
            <div className="gift-card__code">{card.code}</div>
            <div className="gift-card__msg">Identification code</div>
          </section>
        </article>
      </div>
    </div>
  )
}

export default GiftCardCustomer;
