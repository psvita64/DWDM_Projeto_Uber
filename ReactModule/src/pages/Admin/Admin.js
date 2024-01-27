import React, { useState, useEffect } from "react";
import "./Admin.css";
import RestaurantesList from "../Restaurantes/RestaurantesLista";
import CreateRestaurant from "./CreateRestaurant/Create";
import { useNavigate, Link } from "react-router-dom";
import pedidos from "../Cart/PedidosLista";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function Admin() {
  const [PedidosLista, setPedidosLista] = useState([]); 
  const [selectedTable, setSelectedTable] = useState("");
  const [restaurantes, setRestaurantes] = useState([]);
  const Navigate = useNavigate();
  const [usersList, setUsersList] = useState([]);



  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = "http://localhost:9000/system/order";
      const response = await axios.get(url, {
        headers: {
          Authorization: token,
        },
      });
  
      console.log("API Response for orders:", response);
  
      const data = response.data;
  
      console.log("Data received for orders:", data);
  
      if (data.success) {
        setPedidosLista(data.orders);
      } else {
        console.error("API request for orders was not successful");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  
  /*
  const getImage = async (id) => {
    try {
      const url = `http://localhost:9000/system/image/${id}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  }*/

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = "http://localhost:9000/admin/users";
      const response = await axios.get(url, {
        headers: {
          Authorization: token,
        },
      });
      console.log("API Response:", response);
      const data = response.data.utilizadores;
      setUsersList(data);
      console.log("lista de users :" + data)
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = localStorage.getItem("token");
        const url = "http://localhost:9000/user/restaurants";
        const response = await axios.get(url, {
          headers: {
            Authorization: token,
          },
        });
        const data = response.data.restaurantes; 
        setRestaurantes(data);
        console.log("Data received:", data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurants();
  }, []);

  const handleRestaurantClick = (restaurantId) => {
    Navigate(`/myrestaurant/${restaurantId}`);
  };

  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers(usersList);
  }, [usersList]);

  useEffect(() => {
    console.log("PedidosLista in useEffect:", PedidosLista);
  }, [PedidosLista]);

  useEffect(() => {
    const updateRestaurantes = (updatedList) => {
      setRestaurantes(updatedList);
    };
  }, []);

  return (
    <div>
      <h1>Admin Page</h1>
      <button
        onClick={() => {
          setSelectedTable("Restaurantes");
          //  getRestaurants();
        }}
      >
        Restaurantes
      </button>
      <button onClick={() => setSelectedTable("Pedidos")}>Pedidos</button>
      <button onClick={() => setSelectedTable("Users")}>Users</button>

      {selectedTable === "Restaurantes" && (
        <div>
          <Link to="./create">
            <button>Criar Restaurante</button>
          </Link>
          <table className="tableAdmin">
            <thead>
              <tr className="grid-container-admin">
                <th className="grid-item-admin ">Nome</th>
                <th className="grid-item-admin"> Ícone</th>
              </tr>
            </thead>
            <tbody>
              {restaurantes.map((restaurante) => (
                <tr key={restaurante._id}>
                <td onClick={() => handleRestaurantClick(restaurante._id)}>
                  {restaurante.campanyName}
                  <img src={`http://localhost:9000/system/image/${restaurante._id}`} alt={restaurante.campanyName} />
                </td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

{selectedTable === "Pedidos" && (
  <table className="tableAdmin">
    <thead>
      <tr>
        <th>User</th>
        <th>Restaurant</th>
        <th>Items</th>
        <th>Preço</th>
        <th>Estado</th>
      </tr>
    </thead>
    <tbody>
      {PedidosLista && PedidosLista.length > 0 ? (
        PedidosLista.map((pedido) => {
          const user = usersList.find(user => user._id === pedido.userId);
          const restaurant = restaurantes.find(restaurant => restaurant && restaurant.id === pedido._id);

          return (
            <tr key={pedido._id}>
              <td>{user ? `${user.firstName} ${user.lastName}` : 'Unknown User'}</td>
              <td>{restaurant ? restaurant.campanyName : 'Unknown Restaurant'}</td>
              <td>
                <ul>
                  {pedido.orderItems.map((item) => (
                    <li key={item.name}>
                      {item.name} - Quantity: {item.quantity}
                    </li>
                  ))}
                </ul>
              </td>
              <td>{pedido.orderTotal}</td>
              <td>{pedido.orderStatus}</td>
            </tr>
          );
        })
      ) : (
        <tr>
          <td colSpan="5">No orders available</td>
        </tr>
      )}
    </tbody>
  </table>
)}

      {selectedTable === "Users" && (
        <table className="tableAdmin">
          <thead>
            <tr className="topicsAdmin">
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
          {users.map((user) => (
  <tr key={user._id}>
    <td>{`${user.firstName} ${user.lastName}`}</td>
    <td>{user.email}</td>
  </tr>
))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Admin;
