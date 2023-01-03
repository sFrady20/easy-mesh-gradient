import { ReactNode, useEffect } from "react";
import { useState } from "react";
import { animated, Controller } from "@react-spring/web";

function Transitioner(props: { seed: string; children?: ReactNode }) {
  const { seed, children } = props;

  const [entries, setEntries] = useState<{
    [seed: string]: { child: ReactNode; controller: Controller };
  }>({});

  useEffect(() => {
    setEntries((entries) => {
      let entry = entries[seed];

      if (!entry) {
        const controller = new Controller({ opacity: 0 });
        entry = {
          child: (
            <animated.div key={seed} style={controller.springs}>
              {children}
            </animated.div>
          ),
          controller,
        };
        entries[seed] = entry;
      }

      entry.controller.start({ opacity: 1 });

      Object.keys(entries)
        .filter((x) => x !== seed)
        .forEach((y) => {
          entries[y].controller.start({ opacity: 0 }).then(() => {
            setEntries(({ ...x }) => {
              delete x[y];
              return x;
            });
          });
        });

      return { ...entries };
    });
  }, [seed, children]);

  return <>{Object.values(entries).map((x) => x.child)}</>;
}

export default Transitioner;
