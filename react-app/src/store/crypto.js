const GET_CRYPTO = "crypto/GET_CRYPTO";
const SEARCH_CRYPTO = "crypto/SEARCH_CRYPTO"
const LOAD_ONE = "crypto/LOAD_ONE"

const getCrypto = (crypto) => ({
  type: GET_CRYPTO,
  crypto,
});

const searchCrypto = (crypto) => ({
  type: SEARCH_CRYPTO,
  crypto,
})

const load_one = loadOneCrypto => ({
  type: LOAD_ONE,
  loadOneCrypto
})


export const getAllCrypto = () => async (dispatch) => {
  const res = await fetch("/api/cryptocurrencies");
  if (res.ok) {
    const data = await res.json();
    dispatch(getCrypto(data));
  }
};

export const getOneCrypto = (id) => async dispatch => {
  const response = await fetch(`/api/cryptocurrencies/${id}`);
  console.log"("!!!!!!!!!!!!, response)

  if (response.ok) {
      const cryptocurrencyDetail = await response.json();
      dispatch(load_one(cryptocurrencyDetail))
      return cryptocurrencyDetail;
  }
}

export const findCrypto = (results) => async (dispatch) => {
  const res = await fetch("/api/cryptocurrencies/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({results})
  })
    if(res.ok) {
      const data = await res.json()
      dispatch(searchCrypto(data))
    }
}

const initialState = { crypto: null };

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_CRYPTO:
      return { ...state, crypto: action.crypto.cryptocurrency };
    case SEARCH_CRYPTO:
      return {...state, searchRes: action.crypto.search};
    case LOAD_ONE:
      return {...state, getOneCrypto: action.loadOneCrypto.k};
    default:
      return state;
  }
}
