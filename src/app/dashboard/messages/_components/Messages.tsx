"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";

export default function Messages({ messages }: { messages: Message[] }) {
  const [filteredMessages, setFilteredMessages] = useState<Message[]>(messages);

  const [searchTerm, setSearchTerm] = useState("");
  const [messageType, setMessageType] = useState<"all" | "user" | "guest">(
    "all"
  );
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 9;

  useEffect(() => {
    let result = [...messages];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (msg) =>
          msg.subject.toLowerCase().includes(term) ||
          msg.message.toLowerCase().includes(term) ||
          msg.name.toLowerCase().includes(term) ||
          msg.email.toLowerCase().includes(term)
      );
    }

    // Apply type filter
    if (messageType !== "all") {
      result = result.filter((msg) =>
        messageType === "user" ? msg.isUser : !msg.isUser
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      return sortOrder === "newest"
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    setFilteredMessages(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [messages, searchTerm, messageType, sortOrder]);

  // Pagination logic
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = filteredMessages.slice(
    indexOfFirstMessage,
    indexOfLastMessage
  );
  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Messages</h1>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Input
          placeholder="Search messages..."
          className="flex-grow text-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Select
          value={messageType}
          onValueChange={(v: "all" | "user" | "guest") => setMessageType(v)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All messages</SelectItem>
            <SelectItem value="user">User messages</SelectItem>
            <SelectItem value="guest">Guest messages</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortOrder}
          onValueChange={(v: "newest" | "oldest") => setSortOrder(v)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Messages Grid */}
      {filteredMessages.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentMessages.map((message) => (
              <MessageCard
                key={message.id}
                message={message}
                onClick={() => setSelectedMessage(message)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            {messages.length === 0
              ? "No messages yet"
              : "No messages match your filters"}
          </p>
        </div>
      )}

      {/* Message Detail Dialog */}
      <Dialog
        open={!!selectedMessage}
        onOpenChange={(open) => !open && setSelectedMessage(null)}
      >
        <DialogContent className="max-w-2xl">
          {selectedMessage && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedMessage.subject}</DialogTitle>
                <div className="text-sm text-muted-foreground">
                  From: {selectedMessage.name} &lt;{selectedMessage.email}&gt;
                </div>
              </DialogHeader>

              <div className="py-4 whitespace-pre-line">
                {selectedMessage.message}
              </div>

              <div className="text-sm text-muted-foreground">
                Received:{" "}
                {format(
                  new Date(selectedMessage.createdAt),
                  "MMM dd, yyyy h:mm a"
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MessageCard({
  message,
  onClick,
}: {
  message: Message;
  onClick: () => void;
}) {
  return (
    <Card
      className="h-full flex flex-col hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg line-clamp-1">
              {message.subject}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
              From: {message.name} &lt;{message.email}&gt;
            </p>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              message.isUser
                ? "bg-blue-100 text-blue-800"
                : "bg-purple-100 text-purple-800"
            }`}
          >
            {message.isUser ? "User" : "Guest"}
          </span>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="flex-grow py-4">
        <p className="text-muted-foreground line-clamp-3">{message.message}</p>
      </CardContent>

      <CardFooter className="text-xs text-muted-foreground">
        {format(new Date(message.createdAt), "MMM dd, yyyy h:mm a")}
      </CardFooter>
    </Card>
  );
}
