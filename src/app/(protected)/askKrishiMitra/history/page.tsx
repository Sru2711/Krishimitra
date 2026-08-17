"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Accordion } from "@base-ui/react";
import {
  ChevronDown,
  ImageIcon,
  Trash,
  X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import { useChat } from "@ai-sdk/react";

import {
  deleteConversation,
  getConversationBasedOnFarmerId,
  getConversationFromConvId,
} from "@/src/services/chat";
import { getTokenFromLocalStorage } from "@/src/services/localStorage";

type MessagePart = {
  type: string;
  text?: string;
  url?: string;
  filename?: string;
  mediaType?: string;
};

type DBMessage = {
  id?: string;
  role: "user" | "assistant";
  parts: MessagePart[];
};

type Conversation = {
  id: string;
  title: string;
  messages: DBMessage[];
  createdAt: string;
  updatedAt: string;
};

type RenderMessage = {
  id?: string;
  role: "user" | "assistant" | "system";
  parts?: MessagePart[];
};

type ImagePreview = {
  file: File;
  url: string;
};

const History = () => {
  // ============================================================
  // STATE
  // ============================================================

  const [conversationHistory, setConversationHistory] = useState<
    Conversation[]
  >([]);

  const [input, setInput] = useState("");

  const [activeConversationId, setActiveConversationId] =
    useState<string | null>(null);

  /*
   * IMPORTANT:
   *
   * Keep FileList because your version of useChat()
   * accepts:
   *
   * FileList | FileUIPart[]
   */
  const [selectedImage, setSelectedImage] =
    useState<FileList | null>(null);

  const [sending, setSending] = useState(false);

  const token = getTokenFromLocalStorage();

  // ============================================================
  // AI SDK
  // ============================================================

  const {
    messages,
    sendMessage,
    setMessages,
    status,
  } = useChat();

  // ============================================================
  // IMAGE PREVIEWS
  // ============================================================

  const imagePreviews = useMemo<ImagePreview[]>(() => {
    if (!selectedImage || selectedImage.length === 0) {
      return [];
    }

    return Array.from(selectedImage).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
  }, [selectedImage]);

  /*
   * Clean up blob URLs.
   */
  useEffect(() => {
    return () => {
      imagePreviews.forEach(({ url }) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [imagePreviews]);

  // ============================================================
  // FETCH HISTORY
  // ============================================================

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response =
          await getConversationBasedOnFarmerId();

        console.log("📚 HISTORY:", response);

        setConversationHistory(response ?? []);
      } catch (error) {
        console.error(
          "❌ Failed to fetch conversations:",
          error,
        );

        toast.error(
          "Failed to load conversation history",
        );
      }
    };

    fetchHistory();
  }, []);

  // ============================================================
  // OPEN CONVERSATION
  // ============================================================

  const handleConversationOpen = async (
    conversationId: string,
  ) => {
    console.log(
      "📂 OPENING CONVERSATION:",
      conversationId,
    );

    try {
      /*
       * Make this conversation active immediately.
       */
      setActiveConversationId(conversationId);

      /*
       * Clear temporary AI SDK messages.
       */
      setMessages([]);

      /*
       * Clear composer.
       */
      setInput("");
      setSelectedImage(null);

      /*
       * Fetch conversation.
       */
      const conversation =
        await getConversationFromConvId(
          conversationId,
        );

      console.log(
        "📂 OPENED CONVERSATION:",
        conversation,
      );

      /*
       * Update only this conversation.
       */
      setConversationHistory((previous) =>
        previous.map((item) =>
          item.id === conversationId
            ? conversation
            : item,
        ),
      );
    } catch (error) {
      console.error(
        "❌ Failed to open conversation:",
        error,
      );

      toast.error(
        "Failed to load conversation",
      );
    }
  };

  // ============================================================
  // DELETE
  // ============================================================

  const handleConversationDelete = async (
    conversationId: string,
  ) => {
    try {
      await deleteConversation(conversationId);

      setConversationHistory((previous) =>
        previous.filter(
          (conversation) =>
            conversation.id !== conversationId,
        ),
      );

      if (
        activeConversationId === conversationId
      ) {
        setActiveConversationId(null);
        setMessages([]);
        setInput("");
        setSelectedImage(null);
        setSending(false);
      }

      toast.success(
        "Deleted your conversation successfully!",
      );
    } catch (error: any) {
      console.error(
        "❌ Delete failed:",
        error,
      );

      toast.error(
        error?.message ||
          "Failed to delete conversation",
      );
    }
  };

  // ============================================================
  // IMAGE CHANGE
  // ============================================================

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    conversationId: string,
  ) => {
    const files = e.target.files;

    console.log("=================================");
    console.log("📸 FILES:", files);
    console.log("📸 FILE COUNT:", files?.length);
    console.log("📸 FIRST FILE:", files?.[0]);
    console.log(
      "📸 FIRST FILE TYPE:",
      files?.[0]?.type,
    );
    console.log(
      "📸 FIRST FILE SIZE:",
      files?.[0]?.size,
    );
    console.log(
      "📸 CONVERSATION:",
      conversationId,
    );
    console.log("=================================");

    if (!files || files.length === 0) {
      return;
    }

    /*
     * IMPORTANT:
     *
     * Selecting an image also makes this conversation active.
     *
     * This fixes the situation where:
     *
     * selectedImage exists
     * BUT
     * isActive === false
     *
     * and therefore the preview never renders.
     */
    setActiveConversationId(conversationId);

    /*
     * Keep FileList.
     *
     * Your useChat() expects FileList.
     */
    setSelectedImage(files);

    /*
     * Allow selecting the same image again.
     */
    e.target.value = "";
  };

  // ============================================================
  // REMOVE SELECTED IMAGES
  // ============================================================

  const handleRemoveImages = () => {
    setSelectedImage(null);
  };

  // ============================================================
  // SEND
  // ============================================================

  const handleSubmit = async (
    conversationId: string,
  ) => {
    if (
      (!input.trim() && !selectedImage) ||
      status === "streaming" ||
      status === "submitted"
    ) {
      return;
    }

    try {
      console.log("🚀 SEND");
      console.log(
        "Conversation:",
        conversationId,
      );
      console.log(
        "Text:",
        input.trim(),
      );
      console.log(
        "Files:",
        selectedImage,
      );
      console.log(
        "File count:",
        selectedImage?.length,
      );

      /*
       * Make sure this conversation is active.
       */
      setActiveConversationId(conversationId);

      setSending(true);

      /*
       * Clear temporary AI SDK messages.
       */
      setMessages([]);

      /*
       * Send FileList directly.
       *
       * DO NOT convert this to File[].
       */
      await sendMessage(
        {
          text: input.trim(),
          files:
            selectedImage ?? undefined,
        },
        {
          body: {
            converstaionalId:
              conversationId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      /*
       * Clear composer after successful submission.
       */
      setInput("");
      setSelectedImage(null);
    } catch (error) {
      console.error(
        "❌ Failed to send:",
        error,
      );

      toast.error(
        "Failed to send message",
      );

      setSending(false);
    }
  };

  // ============================================================
  // ENTER
  // ============================================================

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    conversationId: string,
  ) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();

      handleSubmit(conversationId);
    }
  };

  // ============================================================
  // REFRESH DATABASE AFTER AI RESPONSE
  // ============================================================

  useEffect(() => {
    if (!activeConversationId) {
      return;
    }

    if (status !== "ready") {
      return;
    }

    if (messages.length === 0) {
      return;
    }

    const refreshConversation =
      async () => {
        const conversationId =
          activeConversationId;

        console.log(
          "🔄 REFRESHING CONVERSATION:",
          conversationId,
        );

        try {
          const updatedConversation =
            await getConversationFromConvId(
              conversationId,
            );

          console.log(
            "✅ UPDATED CONVERSATION:",
            updatedConversation,
          );

          setConversationHistory(
            (previous) =>
              previous.map(
                (conversation) =>
                  conversation.id ===
                  conversationId
                    ? updatedConversation
                    : conversation,
              ),
          );

          /*
           * Clear temporary AI SDK messages.
           */
          setMessages([]);

          /*
           * No longer streaming.
           */
          setActiveConversationId(null);
        } catch (error) {
          console.error(
            "❌ Failed to refresh conversation:",
            error,
          );
        } finally {
          setSending(false);
        }
      };

    refreshConversation();
  }, [
    status,
    messages.length,
    activeConversationId,
    setMessages,
  ]);

  // ============================================================
  // RENDER MESSAGE
  // ============================================================

  const renderMessage = (
    message: RenderMessage,
    conversationId: string,
    index: number,
  ) => {
    /*
     * Ignore system messages.
     */
    if (message.role === "system") {
      return null;
    }

    const isUser =
      message.role === "user";

    return (
      <div
        key={
          message.id ??
          `${conversationId}-message-${index}`
        }
        className={`flex w-full ${
          isUser
            ? "justify-end"
            : "justify-start"
        }`}
      >
        <div
          className={`
            max-w-[80%]
            rounded-2xl
            px-4
            py-3
            shadow-sm
            max-h-[300px]
            overflow-y-auto
            farmer-scrollbar
            ${
              isUser
                ? "bg-recommendation text-white rounded-br-md"
                : "bg-gray-100 text-gray-800 rounded-bl-md"
            }
          `}
        >
          <div className="mb-1 text-xs font-semibold opacity-70">
            {isUser
              ? "You"
              : "KrishiMitra"}
          </div>

          <div className="space-y-3">
            {message.parts?.map(
              (part, partIndex) => {
                /*
                 * IMAGE
                 */
                if (
                  part.type === "file" &&
                  part.mediaType?.startsWith(
                    "image/",
                  ) &&
                  part.url
                ) {
                  return (
                    <div
                      key={partIndex}
                      className="flex"
                    >
                      <img
                        src={part.url}
                        alt={
                          part.filename ??
                          "Uploaded image"
                        }
                        className="
                          max-w-[300px]
                          max-h-[300px]
                          rounded-xl
                          object-contain
                        "
                      />
                    </div>
                  );
                }

                /*
                 * TEXT
                 */
                if (
                  part.type === "text" &&
                  part.text
                ) {
                  return (
                    <div
                      key={partIndex}
                      className={`
                        prose
                        prose-sm
                        max-w-none
                        ${
                          isUser
                            ? "prose-invert"
                            : ""
                        }
                      `}
                    >
                      <ReactMarkdown>
                        {part.text}
                      </ReactMarkdown>
                    </div>
                  );
                }

                return null;
              },
            )}
          </div>
        </div>
      </div>
    );
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="w-full">
      {conversationHistory.length === 0 ? (
        <div className="w-full">
          <span className="font-semibold text-recommendation text-2xl">
            No History Of Your
            Conversations
          </span>
        </div>
      ) : (
        conversationHistory.map(
          (conversation, index) => {
            /*
             * Is this the currently active
             * conversation?
             */
            const isActive =
              activeConversationId ===
              conversation.id;

            /*
             * Database messages.
             */
            const dbMessages =
              conversation.messages ?? [];

            /*
             * Temporary AI SDK messages.
             */
            const aiMessages: RenderMessage[] =
              messages.map((message) => ({
                id: message.id,
                role: message.role,
                parts:
                  message.parts as MessagePart[],
              }));

            /*
             * Only append temporary messages
             * to active conversation.
             */
            const displayMessages:
              RenderMessage[] =
              isActive &&
              aiMessages.length > 0
                ? [
                    ...dbMessages,
                    ...aiMessages,
                  ]
                : dbMessages;

            return (
              <Accordion.Root
                key={conversation.id}
                className="
                  w-full
                  h-auto
                  mb-4
                  rounded-xl
                "
              >
                <Accordion.Item
                  value={`Items-${conversation.id}`}
                  onOpenChange={(open) => {
                    if (open) {
                      handleConversationOpen(
                        conversation.id,
                      );
                    }
                  }}
                >
                  {/* ================================================= */}
                  {/* HEADER */}
                  {/* ================================================= */}

                  <Accordion.Header>
                    <Accordion.Trigger
                      className="
                        group
                        flex
                        w-full
                        items-center
                        justify-between
                        rounded-xl
                        bg-recommendation
                        p-4
                        text-lg
                        font-bold
                        text-white
                      "
                    >
                      <span>
                        {conversation.title ||
                          `Conversation ${
                            index + 1
                          }`}
                      </span>

                      <div className="flex items-center justify-center gap-5">
                        {/* DELETE */}

                        <Trash
                          size={20}
                          className="
                            cursor-pointer
                            hover:text-red-300
                          "
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            handleConversationDelete(
                              conversation.id,
                            );
                          }}
                        />

                        {/* CHEVRON */}

                        <ChevronDown
                          size={20}
                          className="
                            transition-transform
                            duration-200
                            group-data-[panel-open]:rotate-180
                          "
                        />
                      </div>
                    </Accordion.Trigger>
                  </Accordion.Header>

                  {/* ================================================= */}
                  {/* PANEL */}
                  {/* ================================================= */}

                  <Accordion.Panel className="p-3">
                    <div
                      className="
                        w-full
                        bg-white
                        border
                        border-black
                        p-3
                        rounded-xl
                      "
                    >
                      {/* ================================================= */}
                      {/* MESSAGES */}
                      {/* ================================================= */}

                      <div className="space-y-5">
                        {displayMessages.length ===
                          0 && (
                          <div className="text-center text-gray-500 py-5">
                            No messages in
                            this conversation.
                          </div>
                        )}

                        {displayMessages.map(
                          (
                            message,
                            messageIndex,
                          ) =>
                            renderMessage(
                              message,
                              conversation.id,
                              messageIndex,
                            ),
                        )}
                      </div>

                      {/* ================================================= */}
                      {/* COMPOSER */}
                      {/* ================================================= */}

                      <div
                        className="
                          mt-4
                          pt-4
                          border-t
                          border-gray-200
                        "
                      >
                        {/* ============================================= */}
                        {/* IMAGE PREVIEW */}
                        {/* ============================================= */}

                        {isActive &&
                          selectedImage &&
                          selectedImage.length >
                            0 && (
                            <div
                              className="
                                w-full
                                mb-4
                                p-3
                                rounded-xl
                                border-2
                                border-alert-amber
                                bg-yellow-50
                              "
                            >
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-semibold text-gray-700">
                                  Selected image
                                  {selectedImage.length >
                                  1
                                    ? "s"
                                    : ""}
                                </span>

                                <button
                                  type="button"
                                  onClick={
                                    handleRemoveImages
                                  }
                                  className="
                                    flex
                                    items-center
                                    gap-1
                                    text-xs
                                    font-semibold
                                    text-red-600
                                  "
                                >
                                  <X
                                    size={14}
                                  />
                                  Remove
                                </button>
                              </div>

                              <div className="flex flex-wrap gap-4">
                                {imagePreviews.map(
                                  (
                                    preview,
                                    previewIndex,
                                  ) => (
                                    <div
                                      key={`${preview.file.name}-${preview.file.lastModified}-${previewIndex}`}
                                      className="
                                        relative
                                        flex
                                        flex-col
                                        items-center
                                      "
                                    >
                                      <img
                                        src={
                                          preview.url
                                        }
                                        alt={
                                          preview
                                            .file
                                            .name
                                        }
                                        className="
                                          w-28
                                          h-28
                                          object-cover
                                          rounded-lg
                                          border-2
                                          border-green-600
                                          bg-white
                                        "
                                      />

                                      <span
                                        className="
                                          mt-1
                                          max-w-28
                                          truncate
                                          text-xs
                                          text-gray-600
                                        "
                                      >
                                        {
                                          preview
                                            .file
                                            .name
                                        }
                                      </span>

                                      <button
                                        type="button"
                                        onClick={
                                          handleRemoveImages
                                        }
                                        className="
                                          absolute
                                          -top-2
                                          -right-2
                                          w-6
                                          h-6
                                          rounded-full
                                          bg-red-500
                                          text-white
                                          flex
                                          items-center
                                          justify-center
                                        "
                                      >
                                        <X
                                          size={
                                            14
                                          }
                                        />
                                      </button>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          )}

                        {/* ============================================= */}
                        {/* INPUT ROW */}
                        {/* ============================================= */}

                        <div className="flex gap-2 items-center w-full">
                          {/* TEXT */}

                          <input
                            value={
                              isActive
                                ? input
                                : ""
                            }
                            onChange={(e) =>
                              setInput(
                                e.target.value,
                              )
                            }
                            onKeyDown={(e) =>
                              handleKeyDown(
                                e,
                                conversation.id,
                              )
                            }
                            placeholder="Ask something..."
                            disabled={
                              sending &&
                              isActive
                            }
                            className="
                              flex-1
                              min-w-0
                              border
                              border-gray-300
                              rounded-lg
                              px-3
                              py-2
                              outline-none
                              focus:ring-2
                              focus:ring-alert-amber
                              disabled:bg-gray-100
                            "
                          />

                          {/* IMAGE */}

                          {/* <label
                            htmlFor={`image-upload-${conversation.id}`}
                            className="
                              flex
                              items-center
                              justify-center
                              shrink-0
                              cursor-pointer
                              border
                              border-gray-300
                              px-3
                              py-2
                              rounded-lg
                              hover:bg-gray-100
                            "
                          >
                            <ImageIcon
                              size={20}
                            />

                            <input
                              id={`image-upload-${conversation.id}`}
                              type="file"
                              accept="image/*"
                              multiple
                              hidden
                              onChange={(e) =>
                                handleImageChange(
                                  e,
                                  conversation.id,
                                )
                              }
                            />
                          </label> */}

                          {/* SEND */}

                          <button
                            type="button"
                            disabled={
                              sending ||
                              (!input.trim() &&
                                !selectedImage)
                            }
                            onClick={() =>
                              handleSubmit(
                                conversation.id,
                              )
                            }
                            className="
                              shrink-0
                              bg-alert-amber
                              text-black
                              font-bold
                              px-4
                              py-2
                              rounded-lg
                              hover:opacity-80
                              disabled:opacity-50
                              disabled:cursor-not-allowed
                            "
                          >
                            {sending
                              ? "Sending..."
                              : "Send"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion.Root>
            );
          },
        )
      )}
    </div>  
  );
};

export default History;