import remarkGridTables from '@adobe/remark-gridtables';
import { memo } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './code-block';

const components: Partial<Components> = {
  //@ts-expect-error
  code: CodeBlock,
  pre: ({ children }) => <>{children}</>,
  ol: ({ children, ...props }) => (
    <ol className="list-decimal list-outside ml-4" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="py-1" {...props}>
      {children}
    </li>
  ),
  ul: ({ children, ...props }) => (
    <ul className="list-disc list-outside ml-4" {...props}>
      {children}
    </ul>
  ),
  strong: ({ children, ...props }) => (
    <span className="font-semibold" {...props}>
      {children}
    </span>
  ),
  a: ({ children, ...props }) => (
    <a
      className="text-blue-500 hover:underline"
      target="_blank"
      rel="noreferrer"
      href={props.href || '#'}
      {...props}
    >
      {children}
    </a>
  ),
  h1: ({ children, ...props }) => (
    <h1 className="text-3xl font-semibold mt-6 mb-2" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="text-2xl font-semibold mt-6 mb-2" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="text-xl font-semibold mt-6 mb-2" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 className="text-lg font-semibold mt-6 mb-2" {...props}>
      {children}
    </h4>
  ),
  h5: ({ children, ...props }) => (
    <h5 className="text-base font-semibold mt-6 mb-2" {...props}>
      {children}
    </h5>
  ),
  h6: ({ children, ...props }) => (
    <h6 className="text-sm font-semibold mt-6 mb-2" {...props}>
      {children}
    </h6>
  ),
  table: ({ children, ...props }) => (
    <table className="table-auto border-collapse border border-black rounded-md" {...props}>
      {children}
    </table>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-transparent" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }) => (
    <tbody {...props}>
      {children}
    </tbody>
  ),
  tr: ({ children, ...props }) => (
    <tr className="border-b border-black" {...props}>
      {children}
    </tr>
  ),
  th: ({ children, ...props }) => (
    <th className="px-4 py-2 border-x border-black text-left font-medium text-black" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="px-4 py-2 border-x border-black text-black" {...props}>
      {children}
    </td>
  ),
  // img: ({ src = '', alt = '', ...props }) => {
  //   // Define default dimensions or extract from props if available
  //   const width = props.width || 600;
  //   const height = props.height || 400;

  //   return (
  //     <Image
  //       src={src}
  //       alt={alt}
  //       width={width as number}
  //       height={height as number}
  //       className='bg-white'
  //       // layout="responsive"
  //     />
  //   );
  // },
  img: ({ node, ...props }) => (
    <img
      {...props}
      className='bg-white'
      style={{ maxWidth: '100%', height: 'auto' }}
      alt={props.alt || ''}
    />
  ),
};

const remarkPlugins = [remarkGfm, remarkGridTables];

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);
