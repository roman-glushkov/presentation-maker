import { Slide } from '../../../../store/types/presentation';

export default function bringToFront(updateSlide: (u: (s: Slide) => Slide) => void, elId: string) {
  updateSlide((s: Slide) => {
    const el = s.elements.find((e) => e.id === elId);
    if (!el) return s;
    return { ...s, elements: [...s.elements.filter((e) => e.id !== elId), el] };
  });
}
