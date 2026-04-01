import { JSX, ReactNode } from "react";
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
// import { highlight } from 'sugar-high'


type CodeProps = React.HTMLAttributes<HTMLElement> & { children: string };

// function Code({children, ...props}: CodeProps ) {
//     const codeHTML = highlight(children)
//     return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
// }

const components = {
    // code : Code,
    h1 : (props: React.HTMLAttributes<HTMLHeadingElement> & { children: ReactNode }) => (
        <h1 {...props}  className="text-3xl font-bold mt-8 mb-4"
        >{props.children}</h1>
    ),
    h2 : (props: React.HTMLAttributes<HTMLHeadingElement> & { children: ReactNode }) => (
        <h2 {...props}  className="text-2xl text-muted-foreground font-bold mt-8 mb-4"
        >{props.children}</h2>
    ),
    p : (props: React.HTMLAttributes<HTMLParagraphElement> & { children: ReactNode }) => (
        <p {...props}  className="my-2"
        >{props.children}</p>
    ),
    a : (props: React.HTMLAttributes<HTMLAnchorElement> & { children: ReactNode }) => (
        <a {...props}  className="font-light text-muted-foreground transition-colors hover:text-foreground underline"
        >{props.children}</a>
    ),
    img : (props: React.HTMLAttributes<HTMLImageElement> & { children: ReactNode }) => (
        <img {...props}  className="my-2 rounded-lg"
        />
    ),
    
}

export default function MDXContent(
    props: JSX.IntrinsicAttributes & MDXRemoteProps
){
    return (
        <MDXRemote
        {...props}
        components = {{...components, ...(props.components || { })}}
        />
    )
}