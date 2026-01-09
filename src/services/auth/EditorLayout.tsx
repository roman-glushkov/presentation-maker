import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Toolbar from '../../common/components/Toolbar';
import SlidesPanel from '../../common/components/SlidesPanel';
import Workspace from '../../common/components/Workspace';
import useUndoRedoHotkeys from '../../common/components/Workspace/hooks/useUndoRedoHotkeys';
import { setPresentationId } from '../../store/editorSlice';

export default function EditorLayout() {
  useUndoRedoHotkeys();
  const { presentationId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (presentationId) {
      dispatch(setPresentationId(presentationId));
    }
  }, [presentationId, dispatch]);

  return (
    <>
      <Toolbar />
      <div className="main-content">
        <SlidesPanel />
        <Workspace />
      </div>
    </>
  );
}
