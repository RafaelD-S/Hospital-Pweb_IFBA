export const onlyDigits = (value = "") => value.replace(/\D/g, "");

export const isValidEmail = (value = "") => /\S+@\S+\.\S+/.test(value);

export const isValidPhone = (value = "") =>
  /^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/.test(value);

export const isValidZip = (value = "") => /^\d{5}-?\d{3}$/.test(value);

export const isValidState = (value = "") => /^[A-Za-z]{2}$/.test(value);

export const isValidCrm = (value = "") =>
  /^CRM\/([A-Za-z]{2})\s\d{6}$/.test(value);

export const isValidCpf = (value = "") => {
  const cpfDigits = onlyDigits(value);
  if (cpfDigits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpfDigits)) return false;

  const calcDigit = (base, factor) => {
    let total = 0;
    for (let i = 0; i < base.length; i += 1) {
      total += parseInt(base.charAt(i), 10) * (factor - i);
    }
    const remainder = total % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const digit1 = calcDigit(cpfDigits.slice(0, 9), 10);
  const digit2 = calcDigit(cpfDigits.slice(0, 10), 11);

  return (
    parseInt(cpfDigits.charAt(9), 10) === digit1 &&
    parseInt(cpfDigits.charAt(10), 10) === digit2
  );
};
