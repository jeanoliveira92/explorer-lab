import IMask from "imask"
import "./css/index.css"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")
function setCardType(type) {
  const colors = {
    visa: ["#436D99", "2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "grey"],
  }

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][0])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

//setCardType("mastercard")
globalThis.setCardType = setCardType

const securityCode = document.querySelector("#security-code")
const securityCodeMasked = IMask(securityCode, { mask: "0000" })

const expirationCode = document.querySelector("#expiration-date")
const expirationCodeMasked = IMask(expirationCode, {
  mask: "MM{/}YY",
  blocks: {
    MM: { mask: IMask.MaskedRange, from: 1, to: 12 },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
})

const cardNumber = document.querySelector("#card-number")
const cardNumberMasked = IMask(cardNumber, {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      cardType: "visa",
      regex: /^4\d{0,15}/,
    },
    {
      mask: "0000 0000 0000 0000",
      cardType: "mastercard",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]d|^2[3-7]d{0,2})\d{0,12}/,
    },
    {
      mask: "0000 0000 0000 0000",
      cardType: "default",
    },
  ],

  dispatch: (appended, dynamicMasked) => {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")

    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })

    console.log(foundMask)
    return foundMask
  },
})

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  alert("Cartão adicionado!")
})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")
  ccHolder.innerText =
    cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
})

securityCodeMasked.on("accept", () => {
  const ccSecurity = document.querySelector(".cc-security .value")

  ccSecurity.innerText =
    securityCodeMasked.length === 0 ? "123" : securityCodeMasked.value
})

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardType
  setCardType(cardType)

  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText =
    cardNumberMasked.value.length === 0
      ? "1234 5678 9102 3456"
      : cardNumberMasked.value
})

expirationCodeMasked.on("accept", () => {
  const ccExpiration = document.querySelector(".cc-extra .value")

  ccExpiration.innerText =
    expirationCodeMasked.length === 0 ? "02/32" : expirationCodeMasked.value
})
