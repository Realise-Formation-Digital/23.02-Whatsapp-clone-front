import { defineStore } from "pinia";
import AxiosLib from "../libs/axios";
import { urls } from "../libs/consts";
import { mdiConsoleNetworkOutline } from "@mdi/js";

const chatStore = defineStore("chat", {
  state: () => ({
    userName: "",
    roomId: "",
    roomsAndMessages: [],
  }),

  getters: {
    getUserName: (state) => state.userName,
    getRoomId: (state) => state.roomId,
    getRoomsAndMessage: (state) => state.roomsAndMessages,
  },

  actions: {
    setUserName(value) {
      this.userName = value;
    },

    SetMessage(value) {
      this.message = value;
    },

    async postUser(userName) {
      let json = {
        username: userName,
      };
      console.log("[chatStore][Post] post user name", json);
      try {
        const result = await AxiosLib.postUser(urls.userLogin, json);
        console.log(result);
      } catch (e) {
        throw new Error(e);
      }
    },

    async test() {
      try {
        const result = await AxiosLib.get(urls.message);
      } catch (e) {
        throw new Error(e);
      }
    },

    async postMessage(body) {
      try {
        const result = await AxiosLib.post(urls.message, body);
        console.log(result);
      } catch (e) {
        throw new Error(e);
      }
    },

    /**
     * Login Function
     * @async
     * @param {String} username - the username that we need for our login
     * @returns {Promise<void>}
     */
    async login(username) {
      console.log("[UserStore][login] Logging in with params", username);
      try {
        const result = await AxiosLib.post(urls.userLogin, {
          username: username,
        });
        console.log("Result", result);
        this.userName = result.username;
      } catch (e) {
        console.error(e);
      }
    },

    async sendMessage(sender, message, roomId) {
      console.log(
        "[UserMessage][Messages] message send",
        message,
        sender,
        roomId
      );
      try {
        const messageInserted = await AxiosLib.post(urls.message, {
          message: message,
          roomId: roomId,
          sender: sender,
        });
        const foundRoom = this.roomsAndMessages.find(
          (room) => room._id === roomId
        );
        const foundMessage = foundRoom.messages.find((msg) => msg._id === messageInserted._id)
        if (!foundMessage) foundRoom.messages.push(messageInserted);
      } catch (e) {
        console.error(e);
      }
    },

    async getAllRoomsByUser(userName) {
      try {
        const result = await AxiosLib.get(urls.roomsByUser + userName);
        this.roomsAndMessages = result;
        this.roomId = result[0]._id;
        console.log("result GET", this.roomsAndMessages);
      } catch (e) {
        console.error(e);
      }
    },

    insertMessageBySocket(message) {
      console.log("store", message);
      const foundMessage = this.roomsAndMessages[0].messages.find(
        // (message) => message._id === message._id,
        (msg) => {
          console.log(msg)
          return msg._id === message._id
        },
      );
      console.log("store2", foundMessage);
      if (!foundMessage) this.roomsAndMessages[0].messages.push(message);
    },
  },
});
export { chatStore };
