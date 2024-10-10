import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';

export default function ModalDelete({
    isOpen,
    setIsOpen,
    handle,
    title = 'Delete',
    subTitle = 'This action cannot be undone.',
    buttonOKText = 'Delete',
    buttonOKColor = '',
}) {
    const userTheme = useSelector((state) => state.userTheme);
    const { theme } = userTheme;
    function closeModal() {
        setIsOpen(false);
    }

    function openModal() {
        setIsOpen(true);
    }

    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50 "
                    onClose={closeModal}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel
                                    className={`w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all
                                        ${
                                            theme == 'dark'
                                                ? 'bg-darkPrimary'
                                                : 'bg-white'
                                        }
                                        `}
                                >
                                    <Dialog.Title
                                        as="h3"
                                        className={`text-lg font-medium leading-6  ${
                                            theme == 'dark'
                                                ? 'text-white'
                                                : 'text-gray-900'
                                        }`}
                                    >
                                        {title}
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            {subTitle}
                                        </p>
                                    </div>

                                    <div className="mt-4">
                                        <div className="flex justify-end space-x-4">
                                            <button
                                                type="button"
                                                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                onClick={closeModal}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                className={`${
                                                    buttonOKColor
                                                        ? buttonOKColor
                                                        : 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-500'
                                                } inline-flex justify-center rounded-md border border-transparent  px-4 py-2 text-sm font-medium text-white  focus:outline-none focus-visible:ring-2  focus-visible:ring-offset-2 `}
                                                onClick={() => {
                                                    handle();
                                                    closeModal();
                                                }}
                                            >
                                                {buttonOKText}
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
