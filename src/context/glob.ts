// const context = new Map();

// const coreContext = (context) => {
//     return () => context;
// }

// const getContext = coreContext(context);

// export { getContext };

import { createNamespace } from 'cls-hooked';

const session = createNamespace('hualazimi');

const coreContext = () => () => session;

const getContext = coreContext();

export { getContext };