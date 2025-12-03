import { GROUPS, GroupButton, GroupKey } from '../constants/config';
import ColorSection from './ColorSection';
import TextOptionsPopup from './TextOptionsPopup';
import TextAlignPopup from './TextAlignPopup';
import TemplatePopup from './TemplatePopup';
import ImageUploadPopup from './ImageUploadPopup';
import { TEXT_SIZE_OPTIONS, LINE_HEIGHT_OPTIONS } from '../constants/textOptions';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { handleAction } from '../../../../store/editorSlice';
import { setActiveTextOption } from '../../../../store/toolbarSlice';

export default function ToolbarGroup() {
  const dispatch = useAppDispatch();
  const activeGroup = useAppSelector((state) => state.toolbar.activeGroup) as GroupKey;
  const activeTextOption = useAppSelector((state) => state.toolbar.activeTextOption);

  const handleButtonClick = (action: string) => {
    if (
      [
        'ADD_SLIDE',
        'TEXT_COLOR',
        'SHAPE_FILL',
        'SLIDE_BACKGROUND',
        'TEXT_SIZE',
        'TEXT_ALIGN',
        'TEXT_LINE_HEIGHT',
        'ADD_IMAGE',
      ].includes(action)
    ) {
      dispatch(setActiveTextOption(activeTextOption === action ? null : action));
    } else {
      dispatch(handleAction(action));
    }
  };

  return (
    <div className="toolbar-group">
      {GROUPS[activeGroup].map((btn: GroupButton) => (
        <div key={btn.action} className="toolbar-button-wrapper">
          <button onClick={() => handleButtonClick(btn.action)}>{btn.label}</button>
          {btn.action === 'ADD_SLIDE' && activeTextOption === 'ADD_SLIDE' && <TemplatePopup />}
          {btn.action === 'TEXT_COLOR' && activeTextOption === 'TEXT_COLOR' && (
            <ColorSection type="text" />
          )}
          {btn.action === 'SHAPE_FILL' && activeTextOption === 'SHAPE_FILL' && (
            <ColorSection type="fill" />
          )}
          {btn.action === 'SLIDE_BACKGROUND' && activeTextOption === 'SLIDE_BACKGROUND' && (
            <ColorSection type="background" />
          )}
          {btn.action === 'TEXT_SIZE' && activeTextOption === 'TEXT_SIZE' && (
            <TextOptionsPopup
              options={TEXT_SIZE_OPTIONS.map((o) => o.key)}
              onSelect={(key: string) => {
                dispatch(handleAction(`TEXT_SIZE:${key}`));
                dispatch(setActiveTextOption(null));
              }}
            />
          )}
          {btn.action === 'TEXT_ALIGN' && activeTextOption === 'TEXT_ALIGN' && (
            <TextAlignPopup
              onSelect={(key: string) => {
                if (['left', 'right', 'center', 'justify'].includes(key)) {
                  dispatch(handleAction(`TEXT_ALIGN_HORIZONTAL:${key}`));
                } else if (['top', 'middle', 'bottom'].includes(key)) {
                  dispatch(handleAction(`TEXT_ALIGN_VERTICAL:${key}`));
                }
                dispatch(setActiveTextOption(null));
              }}
            />
          )}
          {btn.action === 'TEXT_LINE_HEIGHT' && activeTextOption === 'TEXT_LINE_HEIGHT' && (
            <TextOptionsPopup
              options={LINE_HEIGHT_OPTIONS.map((o) => o.key)}
              onSelect={(key: string) => {
                dispatch(handleAction(`TEXT_LINE_HEIGHT:${key}`));
                dispatch(setActiveTextOption(null));
              }}
            />
          )}
          {btn.action === 'ADD_IMAGE' && activeTextOption === 'ADD_IMAGE' && <ImageUploadPopup />}
        </div>
      ))}
    </div>
  );
}
