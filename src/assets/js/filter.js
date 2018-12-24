export let priceFilter = (val, sign='') => {
  let value = parseFloat(val)
  if (!value) return
  return value.toFixed(2) + sign
}