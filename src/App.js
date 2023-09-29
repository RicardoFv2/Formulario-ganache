import React, { useState } from "react";
import Web3 from "web3";
import Swal from "sweetalert2";

function App() {
  const web3 = new Web3("http://127.0.0.1:7545");

  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");

  const handleTransfer = async () => {
    try {
      //Serie de Validaciones
      const isValidEthereumAddress = (address) => {
        return /^0x[a-fA-F0-9]{40}$/.test(address);
      };

      if (
        !isValidEthereumAddress(fromAddress) ||
        !isValidEthereumAddress(toAddress)
      ) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Por favor, ingresa direcciones Ethereum válidas.",
        });
        return;
      }

      const isValidAmount = (amount) => {
        const parsedAmount = parseFloat(amount);
        return !isNaN(parsedAmount) && parsedAmount > 0;
      };

      if (!isValidAmount(amount)) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Por favor, ingresa un monto válido y mayor que cero.",
        });
        return;
      }

      const fromBalance = await web3.eth.getBalance(fromAddress);
      const balanceInEther = web3.utils.fromWei(fromBalance, "ether");

      if (parseFloat(balanceInEther) < parseFloat(amount)) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Saldo insuficiente en la dirección de origen.",
        });
        return;
      }

      if (!fromAddress || !toAddress || !amount) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Por favor, completa todos los campos.",
        });
        return;
      }

      const accounts = await web3.eth.getAccounts();
      await web3.eth.sendTransaction({
        from: fromAddress,
        to: toAddress,
        value: web3.utils.toWei(amount, "ether"),
      });

      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Transferencia exitosa.",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Error: ${err.message}`,
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">
        Formulario de Transferencia
      </h1>
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">
          Dirección de origen:
        </label>
        <input
          type="text"
          value={fromAddress}
          onChange={(e) => setFromAddress(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">
          Dirección de destino:
        </label>
        <input
          type="text"
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">
          Monto a transferir (ETH):
        </label>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none"
        onClick={handleTransfer}
      >
        Transferir
      </button>
    </div>
  );
}

export default App;
