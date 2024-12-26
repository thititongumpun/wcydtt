interface Point {
  latitude: number;
  longitude: number;
}

interface RoadShieldReference {
  reference: string;
  shieldContent: string;
  affixes?: string[];
}

interface Announcement {
  point: Point;
  pointIndex: number;
  maneuver: string;
  distanceInMeters: number;
}

interface Instruction {
  routeOffsetInMeters: number;
  travelTimeInSeconds: number;
  point: Point;
  pointIndex: number;
  instructionType: string;
  roadNumbers?: string[];
  phoneticRoadNumbers?: string[];
  phoneticRoadNumberLanguageCodes?: string[];
  street?: string;
  phoneticStreet?: string;
  phoneticStreetLanguageCode?: string;
  countryCode?: string;
  signpostText?: string;
  phoneticSignPostText?: string;
  phoneticSignPostTextLanguageCode?: string;
  junctionType?: string;
  turnAngleInDecimalDegrees?: number;
  possibleCombineWithNext?: boolean;
  drivingSide?: string;
  maneuver: string;
  message: string;
  combinedMessage?: string;
  roadShieldReferences?: RoadShieldReference[];
  signpostRoadShieldReferences?: RoadShieldReference[];
  earlyWarningAnnouncement?: Announcement;
  mainAnnouncement?: Announcement;
  confirmationAnnouncement?: Announcement;
}

export type Instructions = Instruction[];
