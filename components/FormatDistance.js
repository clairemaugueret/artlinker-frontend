export const FormatDistance = (distance) => {
  let formattedDistance = "";
  if (distance < 1) {
    formattedDistance = `${(distance * 1000).toFixed(0)} m`;
  } else {
    formattedDistance = `${distance.toFixed(2)} km`;
  }
  return formattedDistance;
};
