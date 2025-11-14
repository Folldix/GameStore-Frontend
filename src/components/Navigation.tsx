import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Heart, Library, User, LogOut, Home } from 'lucide-react';

// ========= Стилізовані компоненти =========
const StyledNav = styled.nav`
  background: linear-gradient(to right, #0D1920, #15202D);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.7);
  padding: 0 1rem;
`;

const StyledContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  font-weight: 900;
  font-family: 'Lato', sans-serif;
  color: #2E9BFA;
  text-shadow: 0 0 5px rgba(46, 155, 250, 0.7);
  transition: text-shadow 0.3s;

  &:hover {
    text-shadow: 0 0 15px rgba(95, 243, 121, 0.9);
  }
`;

const LogoText = styled.span`
  font-size: 1.8rem;
  background-clip: text;
  background-image: linear-gradient(to right, #2E9BFA, #5FF379);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #E6F7FF;
  transition: color 0.3s;
  font-size: 1.1rem;

  &:hover {
    color: #2E9BFA;
  }

  & > svg {
    color: #2E9BFA;
  }
`;

const CartLink = styled(StyledLink)`
  position: relative;
  background: #6272A4;
  padding: 10px 15px;
  border-radius: 8px;
  min-width: 120px;
  justify-content: center;
  transition: background 0.3s;

  &:hover {
    background: #7282B4;
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #E53935;
  color: white;
  font-weight: bold;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-left: 15px;
`;

const StyledButton = styled.button`
  font-size: 1rem;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: opacity 0.3s;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const AdminButton = styled(StyledButton)`
  background: linear-gradient(to right, #6a6d9e, #845ef7);
  color: white;
`;

const LoginButton = styled(StyledButton)`
  background: linear-gradient(to right, #2f9e44, #51cf66);
  color: white;
`;

const LogoutButton = styled(StyledButton)`
  background: linear-gradient(to right, #e03131, #fa5252);
  color: white;
`;

// ========= Основний компонент =========
const Navigation: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <StyledNav>
      <StyledContainer>
        {/* Логотип */}
        <LogoLink to="/">
          <Home size={28} color="#F8F9FA" />
          <LogoText>GAMESTORE</LogoText>
        </LogoLink>

        {/* Основні посилання */}
        <NavLinks>
          <StyledLink to="/">
            <Home size={24} />
            <span>STORE</span>
          </StyledLink>

          {isAuthenticated && (
            <>
              <StyledLink to="/library">
                <Library size={24} />
                <span>LIBRARY</span>
              </StyledLink>
              <StyledLink to="/wishlist">
                <Heart size={24} />
                <span>WISHLIST</span>
              </StyledLink>
            </>
          )}
        </NavLinks>

        {/* Автентифікація */}
        <NavLinks>
          <CartLink to="/cart">
            <ShoppingCart size={26} />
            <span>CART</span>
            {itemCount > 0 && <CartBadge>{itemCount}</CartBadge>}
          </CartLink>

          <ButtonsContainer>
            {isAuthenticated ? (
              <>
                {user?.role === 'ADMIN' && (
                  <AdminButton as={Link} to="/admin">
                    ADMIN
                  </AdminButton>
                )}
                <LogoutButton onClick={logout}>
                  <LogOut size={20} />
                  <span>LOGOUT</span>
                </LogoutButton>
              </>
            ) : (
              <>
                <LoginButton as={Link} to="/login">
                  LOGIN
                </LoginButton>
              </>
            )}
          </ButtonsContainer>
        </NavLinks>
      </StyledContainer>
    </StyledNav>
  );
};

export default Navigation;