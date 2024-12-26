export type Route = {
  points: [number, number][];
  summary: {
    lengthInMeters: number;
    travelTimeInSeconds: number;
  };
};