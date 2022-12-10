import { component$, Resource } from "@builder.io/qwik";
import {
  DocumentHead,
  RequestHandler,
  useEndpoint,
} from "@builder.io/qwik-city";
import { getPost, Post } from "~/lib/client";

export const onGet: RequestHandler<Post> = async ({ params }) => {
  const data = await getPost(params.id);
  return data;
};

// export const onStaticGenerate: StaticGenerateHandler = async () => {
//   const data = await getPostList();
//   const ids = data.contents.map((post) => post.id);
//   return {
//     params: ids.map((id) => {
//       return { id };
//     }),
//   };
// };

export const head: DocumentHead<Post> = ({ data }) => {
  return {
    title: data.title,
    meta: [
      {
        name: "description",
        content: data.content.slice(0, 100) + "...",
      },
    ],
  };
};

export default component$(() => {
  const resource = useEndpoint<Post>();

  return (
    <Resource
      value={resource}
      onPending={() => <div>Loading...</div>}
      onRejected={(error) => <div>Error: {error.message}</div>}
      onResolved={(post) => {
        if (!post) {
          return null;
        }

        return (
          <article>
            <h1>{post.title}</h1>
            <p>
              <time>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </p>
            <div dangerouslySetInnerHTML={post.content} />
          </article>
        )
      }}
    />
  );
});