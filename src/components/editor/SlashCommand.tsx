import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import { Heading1, Heading2, Heading3, List, ListOrdered, CheckSquare, Quote, Code } from 'lucide-react';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

const CommandList = forwardRef((props: any, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command(item);
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }
      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }
      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }
      return false;
    },
  }));

  return (
    <div className="bg-white rounded-lg shadow-lg border border-outline-variant/20 overflow-hidden py-2 w-64">
      {props.items.length ? (
        props.items.map((item: any, index: number) => (
          <button
            className={`flex items-center gap-3 w-full px-4 py-2 text-sm text-left transition-colors ${
              index === selectedIndex ? 'bg-surface-container-low text-primary-container' : 'text-on-surface hover:bg-surface-container-lowest'
            }`}
            key={index}
            onClick={() => selectItem(index)}
          >
            <div className="p-1 bg-surface-container rounded text-on-surface-variant">
              <item.icon className="w-4 h-4" />
            </div>
            <div>
              <div className="font-medium">{item.title}</div>
              <div className="text-xs text-on-surface-variant/70">{item.description}</div>
            </div>
          </button>
        ))
      ) : (
        <div className="px-4 py-2 text-sm text-on-surface-variant">无结果</div>
      )}
    </div>
  );
});

const getSuggestionItems = ({ query }: { query: string }) => {
  return [
    {
      title: '一级标题',
      description: '大号标题',
      icon: Heading1,
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
      },
    },
    {
      title: '二级标题',
      description: '中号标题',
      icon: Heading2,
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
      },
    },
    {
      title: '三级标题',
      description: '小号标题',
      icon: Heading3,
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
      },
    },
    {
      title: '无序列表',
      description: '创建简单的项目符号列表',
      icon: List,
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      title: '有序列表',
      description: '创建带有数字的列表',
      icon: ListOrdered,
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      },
    },
    {
      title: '待办事项',
      description: '创建任务列表',
      icon: CheckSquare,
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).toggleTaskList().run();
      },
    },
    {
      title: '引用',
      description: '插入引用块',
      icon: Quote,
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).toggleBlockquote().run();
      },
    },
    {
      title: '代码块',
      description: '插入代码片段',
      icon: Code,
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
      },
    },
  ].filter((item) => item.title.toLowerCase().startsWith(query.toLowerCase()));
};

export const SlashCommand = Extension.create({
  name: 'slashCommand',
  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }: any) => {
          props.command({ editor, range });
        },
      },
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

export const suggestionOptions = {
  items: getSuggestionItems,
  render: () => {
    let component: ReactRenderer;
    let popup: any;

    return {
      onStart: (props: any) => {
        component = new ReactRenderer(CommandList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        });
      },
      onUpdate(props: any) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },
      onKeyDown(props: any) {
        if (props.event.key === 'Escape') {
          popup[0].hide();
          return true;
        }
        return (component.ref as any)?.onKeyDown(props);
      },
      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};
