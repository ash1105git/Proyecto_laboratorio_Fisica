import { createContext, useContext, useState } from "react";

const LoanCartContext = createContext();

export const useLoanCart = () => useContext(LoanCartContext);

export const LoanCartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  
  // Ahora cada item tendrá cantidad
  const addToCart = (equipment, quantity) => {
    setCartItems(prevItems => {
      const itemExists = prevItems.find(item => item._id === equipment._id);
      if (itemExists) {
        // Actualiza cantidad sumando y limitando a stock disponible
        return prevItems.map(item =>
          item._id === equipment._id
            ? {
                ...item,
                quantity: Math.min(item.quantity + quantity, equipment.quantity)
              }
            : item
        );
      } else {
        // Agrega nuevo item con cantidad
        return [...prevItems, { ...equipment, quantity }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item._id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === id
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  return (
    <LoanCartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, updateQuantity }}
    >
      {children}
    </LoanCartContext.Provider>
  );
};
export default LoanCartProvider;