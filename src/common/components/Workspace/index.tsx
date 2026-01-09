import React from 'react';
import WorkspaceCore from './parts/WorkspaceCore';

interface Props {
  preview?: boolean;
}

export default function Workspace({ preview }: Props) {
  return <WorkspaceCore preview={preview} />;
}
