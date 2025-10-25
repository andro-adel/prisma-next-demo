// Allow importing plain CSS/SCSS files (including side-effect global imports)
// This file prevents TS error: "Cannot find module or type declarations for side-effect import of './globals.css'.ts(2882)"

declare module '*.css' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module '*.scss' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module '*.module.scss' {
    const classes: { [key: string]: string };
    export default classes;
}

// Also allow side-effect imports like `import './globals.css'`
declare module '*.css';
declare module '*.scss';
