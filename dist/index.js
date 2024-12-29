(function (deckyFrontendLib, React) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

  var DefaultContext = {
    color: undefined,
    size: undefined,
    className: undefined,
    style: undefined,
    attr: undefined
  };
  var IconContext = React__default["default"].createContext && React__default["default"].createContext(DefaultContext);

  var __assign = window && window.__assign || function () {
    __assign = Object.assign || function (t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };
  var __rest = window && window.__rest || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
    }
    return t;
  };
  function Tree2Element(tree) {
    return tree && tree.map(function (node, i) {
      return React__default["default"].createElement(node.tag, __assign({
        key: i
      }, node.attr), Tree2Element(node.child));
    });
  }
  function GenIcon(data) {
    // eslint-disable-next-line react/display-name
    return function (props) {
      return React__default["default"].createElement(IconBase, __assign({
        attr: __assign({}, data.attr)
      }, props), Tree2Element(data.child));
    };
  }
  function IconBase(props) {
    var elem = function (conf) {
      var attr = props.attr,
        size = props.size,
        title = props.title,
        svgProps = __rest(props, ["attr", "size", "title"]);
      var computedSize = size || conf.size || "1em";
      var className;
      if (conf.className) className = conf.className;
      if (props.className) className = (className ? className + " " : "") + props.className;
      return React__default["default"].createElement("svg", __assign({
        stroke: "currentColor",
        fill: "currentColor",
        strokeWidth: "0"
      }, conf.attr, attr, svgProps, {
        className: className,
        style: __assign(__assign({
          color: props.color || conf.color
        }, conf.style), props.style),
        height: computedSize,
        width: computedSize,
        xmlns: "http://www.w3.org/2000/svg"
      }), title && React__default["default"].createElement("title", null, title), props.children);
    };
    return IconContext !== undefined ? React__default["default"].createElement(IconContext.Consumer, null, function (conf) {
      return elem(conf);
    }) : elem(DefaultContext);
  }

  // THIS FILE IS AUTO GENERATED
  function FaGithub (props) {
    return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 496 512"},"child":[{"tag":"path","attr":{"d":"M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"}}]})(props);
  }function FaInstagram (props) {
    return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"}}]})(props);
  }function FaTwitter (props) {
    return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"}}]})(props);
  }function FaUsers (props) {
    return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 640 512"},"child":[{"tag":"path","attr":{"d":"M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"}}]})(props);
  }

  let CACHE;
  class Cache {
      constructor() {
          this.APP_ID_KEY = "APP_ID";
          this.PLAYER_COUNT_PREFIX = "PLAYER_COUNT_";
          this.cache = {};
          this.subscribers = new Map();
          this.CACHE_VERSION = "1.0";
          this.CACHE_EXPIRY = 1000 * 60 * 5; // 5 minutes for player count data
          this.CACHE_EXPIRY_LONG = 1000 * 60 * 30; // 30 minutes for other data
          this.loadFromLocalStorage();
          // Clean expired items periodically
          setInterval(() => this.cleanExpiredItems(), 1000 * 60 * 5); // Every 5 minutes
      }
      static init() {
          CACHE = new Cache();
          return CACHE;
      }
      subscribe(id, callback) {
          this.subscribers.set(id, callback);
      }
      unsubscribe(id) {
          this.subscribers.delete(id);
      }
      notifySubscribers() {
          for (const callback of this.subscribers.values()) {
              callback();
          }
      }
      async loadValue(key) {
          const cacheItem = this.cache[key];
          if (cacheItem && this.isValid(cacheItem, this.getExpiryForKey(key))) {
              return cacheItem.value;
          }
          // If cache miss or expired, remove it
          if (cacheItem) {
              delete this.cache[key];
              this.saveToLocalStorage();
          }
          return null;
      }
      async setValue(key, value) {
          const oldValue = await this.loadValue(key);
          if (oldValue !== value) {
              this.cache[key] = {
                  value,
                  timestamp: Date.now(),
                  version: this.CACHE_VERSION
              };
              this.saveToLocalStorage();
              this.notifySubscribers();
          }
      }
      // New method for caching player count data
      async setPlayerCount(appId, count) {
          const key = `${this.PLAYER_COUNT_PREFIX}${appId}`;
          await this.setValue(key, count);
      }
      // New method for retrieving cached player count
      async getPlayerCount(appId) {
          const key = `${this.PLAYER_COUNT_PREFIX}${appId}`;
          return this.loadValue(key);
      }
      getExpiryForKey(key) {
          return key.startsWith(this.PLAYER_COUNT_PREFIX)
              ? this.CACHE_EXPIRY
              : this.CACHE_EXPIRY_LONG;
      }
      isValid(cacheItem, expiry) {
          if (!cacheItem || !cacheItem.timestamp || !cacheItem.version) {
              return false;
          }
          // Check version
          if (cacheItem.version !== this.CACHE_VERSION) {
              return false;
          }
          // Check expiry
          const age = Date.now() - cacheItem.timestamp;
          return age < expiry;
      }
      cleanExpiredItems() {
          let hasChanges = false;
          for (const [key, item] of Object.entries(this.cache)) {
              if (!this.isValid(item, this.getExpiryForKey(key))) {
                  delete this.cache[key];
                  hasChanges = true;
              }
          }
          if (hasChanges) {
              this.saveToLocalStorage();
          }
      }
      saveToLocalStorage() {
          try {
              localStorage.setItem('playerPulseCache', JSON.stringify(this.cache));
          }
          catch (error) {
              console.error('Failed to save cache to localStorage:', error);
          }
      }
      loadFromLocalStorage() {
          try {
              const saved = localStorage.getItem('playerPulseCache');
              if (saved) {
                  this.cache = JSON.parse(saved);
                  this.cleanExpiredItems(); // Clean on load
              }
          }
          catch (error) {
              console.error('Failed to load cache from localStorage:', error);
              this.cache = {};
          }
      }
  }

  const PlayerCount = ({ serverAPI }) => {
      const [appId, setAppId] = React.useState(undefined);
      const [playerCount, setPlayerCount] = React.useState("");
      const [isVisible, setIsVisible] = React.useState(false);
      const mountedRef = React.useRef(true);
      React.useEffect(() => {
          mountedRef.current = true;
          async function loadAppId() {
              if (!mountedRef.current)
                  return;
              const id = await CACHE.loadValue(CACHE.APP_ID_KEY);
              if (!id) {
                  setIsVisible(false);
                  setAppId(undefined);
                  return;
              }
              setAppId(id);
          }
          loadAppId();
          CACHE.subscribe("PlayerCount", loadAppId);
          const handleRouteChange = () => {
              // Check if we're on either a game page or store page
              const isOnGamePage = window.location.pathname.includes('/library/app/');
              const isOnStorePage = window.location.pathname.includes('/steamweb');
              if (!isOnGamePage && !isOnStorePage) {
                  setIsVisible(false);
                  setAppId(undefined);
                  CACHE.setValue(CACHE.APP_ID_KEY, ""); // Clear cache when leaving both pages
              }
          };
          // Listen for both navigation events and history changes
          window.addEventListener('popstate', handleRouteChange);
          window.addEventListener('pushstate', handleRouteChange);
          window.addEventListener('replacestate', handleRouteChange);
          // Initial check
          handleRouteChange();
          return () => {
              mountedRef.current = false;
              CACHE.unsubscribe("PlayerCount");
              setIsVisible(false);
              setAppId(undefined);
              setPlayerCount("");
              window.removeEventListener('popstate', handleRouteChange);
              window.removeEventListener('pushstate', handleRouteChange);
              window.removeEventListener('replacestate', handleRouteChange);
          };
      }, []);
      React.useEffect(() => {
          let interval;
          const fetchPlayerCount = async () => {
              if (!appId || !mountedRef.current) {
                  setIsVisible(false);
                  return;
              }
              try {
                  const response = await serverAPI.fetchNoCors(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appId}`, {
                      method: "GET",
                      headers: { 'Accept': 'application/json' }
                  });
                  if (!mountedRef.current)
                      return;
                  if (response.success) {
                      const data = JSON.parse(response.result.body);
                      if (data.response.result === 1) {
                          const formattedCount = new Intl.NumberFormat().format(data.response.player_count);
                          setPlayerCount(`🟢 Currently Playing: ${formattedCount}`);
                          setIsVisible(true);
                      }
                      else {
                          setPlayerCount("No player data available");
                          setIsVisible(true);
                      }
                  }
                  else {
                      throw new Error("Failed to fetch player count");
                  }
              }
              catch (error) {
                  if (!mountedRef.current)
                      return;
                  setPlayerCount(error instanceof Error ? `Error: ${error.message}` : "Error fetching player count");
                  setIsVisible(true);
              }
          };
          if (appId) {
              fetchPlayerCount();
              interval = setInterval(fetchPlayerCount, 30000);
          }
          else {
              setIsVisible(false);
          }
          return () => {
              if (interval) {
                  clearInterval(interval);
              }
          };
      }, [appId, serverAPI]);
      if (!isVisible)
          return null;
      return (window.SP_REACT.createElement("div", { className: deckyFrontendLib.staticClasses.PanelSectionTitle, onClick: () => {
              if (appId) {
                  deckyFrontendLib.Navigation.NavigateToExternalWeb(`https://steamcharts.com/app/${appId}`);
              }
          }, style: {
              width: 420,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              padding: "7px 16px",
              fontSize: "16px",
              zIndex: 7002,
              position: "fixed",
              bottom: 2,
              left: '50%',
              transform: `translateX(-50%)`,
              color: "#ffffff",
              cursor: "pointer",
          } }, playerCount));
  };

  const History = deckyFrontendLib.findModuleChild((m) => {
      if (typeof m !== 'object')
          return undefined;
      for (const prop in m) {
          if (m[prop]?.m_history)
              return m[prop].m_history;
      }
  });
  function patchStore(serverApi) {
      if (History && History.listen) {
          let oldUrl = "";
          const unlisten = History.listen(async (info) => {
              try {
                  if (info.pathname === '/steamweb') {
                      getCurrentAppID();
                  }
                  else {
                      CACHE.setValue(CACHE.APP_ID_KEY, "");
                  }
              }
              catch (err) {
                  CACHE.setValue(CACHE.APP_ID_KEY, "");
              }
          });
          const getCurrentAppID = async () => {
              const response = await serverApi.fetchNoCors('http://localhost:8080/json');
              let tabs = [];
              if (response.success)
                  tabs = JSON.parse(response.result.body) || [];
              const storeTab = tabs.find((tab) => tab.url.includes('https://store.steampowered.com'));
              const itadTab = tabs.find((tab) => tab.url.includes('https://isthereanydeal.com'));
              if (itadTab) {
                  oldUrl = ""; // This is necessary so that the appID will be set again after closing the external browser
                  setTimeout(() => getCurrentAppID(), 1500);
                  return;
              }
              if (storeTab?.url && storeTab.url !== oldUrl) {
                  oldUrl = storeTab.url;
                  const appId = storeTab.url.match(/\/app\/([\d]+)\/?/)?.[1];
                  if (appId) {
                      CACHE.setValue(CACHE.APP_ID_KEY, appId);
                      // As long as the steam store is open do refreshes
                      setTimeout(() => getCurrentAppID(), 1500);
                  }
                  else {
                      CACHE.setValue(CACHE.APP_ID_KEY, "");
                      // As long as the steam store is open do refreshes
                      setTimeout(() => getCurrentAppID(), 1500);
                  }
              }
              // If tabs do not contain steamstore
              if (!storeTab) {
                  CACHE.setValue(CACHE.APP_ID_KEY, "");
              }
              else {
                  setTimeout(() => getCurrentAppID(), 1500);
              }
          };
          return unlisten;
      }
      return () => {
          CACHE.setValue(CACHE.APP_ID_KEY, "");
      };
  }

  function patchLibrary(serverApi) {
      let isOnLibraryPage = false;
      // Create a reusable patch function
      function patchAppPage(route) {
          const routeProps = deckyFrontendLib.findInReactTree(route, (x) => x?.renderFunc);
          if (routeProps) {
              deckyFrontendLib.afterPatch(routeProps, "renderFunc", (_, ret) => {
                  try {
                      // Extract appId from URL
                      const appId = window.location.pathname.match(/\/library\/app\/([\d]+)/)?.[1];
                      if (appId) {
                          isOnLibraryPage = true;
                          // Update cache with new appId
                          CACHE.setValue(CACHE.APP_ID_KEY, appId);
                      }
                  }
                  catch (error) {
                      console.error("Error in library patch:", error);
                  }
                  return ret;
              });
          }
          return route;
      }
      const handleRouteChange = () => {
          if (!window.location.pathname.includes('/library/app/')) {
              if (isOnLibraryPage) {
                  isOnLibraryPage = false;
                  CACHE.setValue(CACHE.APP_ID_KEY, "");
              }
          }
      };
      window.addEventListener('popstate', handleRouteChange);
      // Add the library page patch
      const unpatch = serverApi.routerHook.addPatch('/library/app/:appid', patchAppPage);
      // Return cleanup function
      return () => {
          if (unpatch) {
              unpatch(null);
          }
          window.removeEventListener('popstate', handleRouteChange);
          if (isOnLibraryPage) {
              CACHE.setValue(CACHE.APP_ID_KEY, "");
          }
      };
  }

  var index = deckyFrontendLib.definePlugin((serverApi) => {
      Cache.init();
      // Add global component
      serverApi.routerHook.addGlobalComponent("PlayerCount", () => window.SP_REACT.createElement(PlayerCount, { serverAPI: serverApi }));
      // Initialize patches
      const storePatch = patchStore(serverApi);
      const libraryPatch = patchLibrary(serverApi);
      return {
          title: window.SP_REACT.createElement("div", { className: deckyFrontendLib.staticClasses.Title }, "Player Pulse"),
          content: (window.SP_REACT.createElement(deckyFrontendLib.PanelSection, { title: "About" },
              window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
                  window.SP_REACT.createElement("div", null, "Shows current player count for your Steam games.")),
              window.SP_REACT.createElement(deckyFrontendLib.PanelSection, { title: "Connect with Me" },
                  window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
                      window.SP_REACT.createElement(deckyFrontendLib.ButtonItem, { layout: "below", onClick: () => window.open("https://github.com/itsOwen", "_blank") },
                          window.SP_REACT.createElement(FaGithub, { style: { marginRight: "8px" } }),
                          "GitHub"),
                      window.SP_REACT.createElement(deckyFrontendLib.ButtonItem, { layout: "below", onClick: () => window.open("https://twitter.com/owensingh_", "_blank") },
                          window.SP_REACT.createElement(FaTwitter, { style: { marginRight: "8px" } }),
                          "Twitter"),
                      window.SP_REACT.createElement(deckyFrontendLib.ButtonItem, { layout: "below", onClick: () => window.open("https://instagram.com/owensingh_", "_blank") },
                          window.SP_REACT.createElement(FaInstagram, { style: { marginRight: "8px" } }),
                          "Instagram"))),
              window.SP_REACT.createElement(deckyFrontendLib.PanelSection, { title: "Contact" },
                  window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
                      window.SP_REACT.createElement("div", null, "Email: owensingh72@gmail.com"))))),
          icon: window.SP_REACT.createElement(FaUsers, null),
          onDismount() {
              serverApi.routerHook.removeGlobalComponent("PlayerCount");
              if (storePatch)
                  storePatch();
              if (libraryPatch)
                  libraryPatch();
          },
      };
  });

  return index;

})(DFL, SP_REACT);
