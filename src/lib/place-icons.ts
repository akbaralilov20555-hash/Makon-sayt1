import {
  MapPin, GraduationCap, Baby, ShoppingBag, Store, HeartPulse, Pill, TrainFront, Bus,
  Trees, Landmark, UtensilsCrossed, Banknote, Dumbbell, ShieldCheck, ShieldAlert, ShieldQuestion,
  type LucideIcon,
} from "lucide-react";
import { NearbyPlaceType, DemolitionStatus } from "@/types";

export const NEARBY_ICONS: Record<NearbyPlaceType, LucideIcon> = {
  school: GraduationCap, kindergarten: Baby, shop: ShoppingBag, market: Store,
  hospital: HeartPulse, pharmacy: Pill, metro: TrainFront, busStop: Bus,
  park: Trees, mosque: Landmark, restaurant: UtensilsCrossed, bank: Banknote,
  gym: Dumbbell, other: MapPin,
};

export const DEMOLITION_ICONS: Record<DemolitionStatus, LucideIcon> = {
  safe: ShieldCheck, soon: ShieldAlert, unknown: ShieldQuestion,
};
