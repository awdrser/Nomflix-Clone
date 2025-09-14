import { atom } from "jotai";

export const isHomeAtom = atom(true);

export interface IClickedItem {
  sliderType: string;
  id: number;
}

// 클릭된 아이템 상태, 기본값 null (아무것도 클릭 안 된 상태)
export const clickedItemAtom = atom<IClickedItem | null>(null);
