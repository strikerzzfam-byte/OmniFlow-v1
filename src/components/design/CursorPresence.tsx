import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

interface Cursor {
  id: string;
  x: number;
  y: number;
  name: string;
  color: string;
}

interface CursorPresenceProps {
  ydoc: Y.Doc | null;
  provider: WebsocketProvider | null;
}

const CursorPresence = ({ ydoc, provider }: CursorPresenceProps) => {
  const [cursors, setCursors] = useState<Cursor[]>([]);
  const [userId] = useState(() => `user-${Math.random().toString(36).substr(2, 9)}`);

  const colors = ['#00B4D8', '#9D4EDD', '#F72585', '#4CC9F0', '#7209B7'];
  const userColor = colors[Math.floor(Math.random() * colors.length)];

  useEffect(() => {
    if (!ydoc || !provider) return;

    const awareness = provider.awareness;
    const userName = `User ${Math.floor(Math.random() * 1000)}`;

    const updateCursors = () => {
      const states = Array.from(awareness.getStates().entries());
      const remoteCursors = states
        .filter(([id]) => id !== awareness.clientID)
        .map(([id, state]: [number, any]) => ({
          id: id.toString(),
          x: state.cursor?.x || 0,
          y: state.cursor?.y || 0,
          name: state.user?.name || `User ${id}`,
          color: state.user?.color || '#00B4D8'
        }));
      
      setCursors(remoteCursors);
    };

    awareness.on('change', updateCursors);

    // Set local user info
    awareness.setLocalStateField('user', {
      name: userName,
      color: userColor
    });

    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      awareness.setLocalStateField('cursor', {
        x: e.clientX,
        y: e.clientY
      });
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      awareness.off('change', updateCursors);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [ydoc, provider, userId, userColor]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {cursors.map((cursor) => (
        <motion.div
          key={cursor.id}
          className="absolute pointer-events-none"
          style={{
            left: cursor.x,
            top: cursor.y,
            transform: 'translate(-2px, -2px)'
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        >
          {/* Cursor */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="drop-shadow-lg"
          >
            <path
              d="M2 2L18 8L8 12L2 18V2Z"
              fill={cursor.color}
              stroke="white"
              strokeWidth="1"
            />
          </svg>
          
          {/* Name label */}
          <div
            className="absolute top-5 left-2 px-2 py-1 rounded text-xs font-medium text-white shadow-lg"
            style={{ backgroundColor: cursor.color }}
          >
            {cursor.name}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CursorPresence;