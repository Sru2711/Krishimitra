import React from "react";
import { Accordion } from "@base-ui/react";
import { ChevronDown } from "lucide-react";

const History = () => {
  return (
    <div className="w-full">
      {[]?.map((conversation, index) => {
        return (
          <Accordion.Root
            // defaultValue="item-1"
            className="w-full h-auto mb-4 rounded-xl"
            key={index}
            //   key={conversation?.id}
          >
            <Accordion.Item value="item-1">
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center justify-between rounded-xl bg-recommendation p-4 text-lg font-bold text-white">
                  {/* <span>{Conversation {index+1}}</span> */}

                  <span>Your Farm Performance Over Time</span>
                  <ChevronDown
                    className="transition-transform duration-200 group-data-[panel-open]:rotate-180"
                    size={20}
                  />
                </Accordion.Trigger>
              </Accordion.Header>

              <Accordion.Panel className="p-3">
                <div className="w-full h-auto bg-white border border-black p-1 mbe-4 rounded-xl ">
                  {[].map((message) => {
                    return (
                      <>
                        <div className={`w-full max-h-60 p-2 flex flex-col sm:flex-row gap-4 overflow font-semibold ${message? "justify-start p-2 text-advisory bg-recommendation":" justify-end p-2 bg-advisory text-recommendation "}`}>

                        </div>

                        {/* <div className="w-full rounded-2xl bg-white shadow-md p-6"></div> */}
                      </>
                    );
                  })}
                </div>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion.Root>
        );
      })}
    </div>
  );
};

export default History;
